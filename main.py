"""Hobal API: camel detection from dashcam video, shared as live road hazards."""
from datetime import datetime, timedelta, timezone
from pathlib import Path
from uuid import uuid4
import os
import io
import threading
import time
from PIL import Image, ImageOps, ImageDraw
from fastapi import UploadFile, File, Form
from fastapi.responses import Response
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from dotenv import load_dotenv

BASE = Path(__file__).resolve().parent
load_dotenv(BASE / '.env')
app = FastAPI(title='هوبال | Hobal Road Safety', version='0.3.0')
app.mount('/static', StaticFiles(directory=BASE / 'static'), name='static')
UTC = timezone.utc
now = lambda: datetime.now(UTC)
# Hazards persist in data/hazards.json so they survive a server restart.
import json
DATA_FILE = BASE / 'data' / 'hazards.json'
DATA_FILE.parent.mkdir(exist_ok=True)
HAZARD_TTL_MIN = int(os.getenv('HAZARD_TTL_MIN', '60'))
SAVE_LOCK = threading.Lock()
events = {}
if DATA_FILE.is_file():
    try:
        events = {e['id']: e for e in json.loads(DATA_FILE.read_text(encoding='utf-8'))}
    except Exception:
        events = {}
def save_events():
    with SAVE_LOCK:
        tmp = DATA_FILE.with_suffix('.tmp')
        tmp.write_text(json.dumps(list(events.values()), ensure_ascii=False, indent=1), encoding='utf-8')
        tmp.replace(DATA_FILE)
def ttl(): return (now()+timedelta(minutes=HAZARD_TTL_MIN)).isoformat()

class HazardIn(BaseModel):
    road: str = Field(min_length=2,max_length=120)
    lat: float = Field(ge=-90,le=90)
    lng: float = Field(ge=-180,le=180)
    severity: str = Field(pattern='^(critical|warning|monitoring)$')
    confidence: float = Field(ge=0,le=1)
    description: str = Field(default='Camel detected',max_length=160)

@app.get('/')
def home(): return FileResponse(BASE/'static'/'index.html')

@app.get('/api/config')
def config(): return {'google_maps_api_key':os.getenv('GOOGLE_MAPS_API_KEY',''),'demo_mode':False}

@app.get('/api/hazards')
def hazards():
    t=now()
    return [e for e in events.values() if e['status']=='active' and datetime.fromisoformat(e['expires_at'])>t]

@app.get('/api/stats')
def stats():
    h=hazards()
    return {'active':len(h),'critical':sum(x['severity']=='critical' for x in h),
            'vehicle_reports':sum(x['report_count'] for x in h),
            'corroborated':sum(x['report_count']>1 for x in h)}

@app.post('/api/hazards',status_code=201)
def create_hazard(data:HazardIn):
    t=now(); eid='HZ-'+uuid4().hex[:6].upper()
    e=dict(id=eid,**data.model_dump(),source='connected_vehicle',report_count=1,
           status='active',detected_at=t.isoformat(),expires_at=ttl())
    events[eid]=e
    save_events()
    return e

@app.post('/api/hazards/{event_id}/corroborate')
def corroborate(event_id:str):
    """Another driver confirms an existing hazard."""
    e=events.get(event_id)
    if not e: raise HTTPException(404,'Hazard not found')
    e['report_count']+=1
    e['expires_at']=ttl()
    save_events()
    return e

@app.post('/api/hazards/{event_id}/resolve')
def resolve(event_id:str):
    if event_id not in events: raise HTTPException(404,'Hazard not found')
    events[event_id]['status']='resolved'
    save_events()
    return {'ok':True,'id':event_id}

@app.post('/api/reset')
def reset():
    for e in events.values(): e['status']='resolved'
    save_events()
    return {'ok':True}

# Manual submissions: image inference requires an actual trained .pt file (not a notebook).
MODEL_PATH = BASE / 'models' / 'best_v3.pt'
UPLOAD_DIR = BASE / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)
_model = None
def get_model():
    global _model
    if not MODEL_PATH.is_file():
        raise HTTPException(503, 'Model weights missing. Check models/best_v3.pt to enable video analysis.')
    if _model is None:
        try:
            from ultralytics import YOLO
            _model = YOLO(str(MODEL_PATH))
        except Exception as exc:
            raise HTTPException(503, f'Could not load YOLO weights: {type(exc).__name__}')
    return _model

@app.get('/api/model/status')
def model_status():
    return {'weights_present':MODEL_PATH.is_file(),'model_name':'best_v3.pt','note':'Trained weights included for video inference'}

@app.get('/api/report-image/{event_id}')
def report_image(event_id: str):
    e=events.get(event_id)
    if not e or e.get('source')!='manual_photo':raise HTTPException(404,'Image not found')
    path=UPLOAD_DIR/(event_id+'.jpg')
    if not path.is_file():raise HTTPException(404,'Image not found')
    return FileResponse(path,media_type='image/jpeg')

@app.post('/api/reports/image')
async def manual_photo_report(photo:UploadFile=File(...),road:str=Form(...),lat:float=Form(...),lng:float=Form(...),description:str=Form('')):
    if not (-90<=lat<=90 and -180<=lng<=180):raise HTTPException(422,'Invalid coordinates')
    if not (2<=len(road)<=120):raise HTTPException(422,'Road name must be 2–120 characters')
    if len(description)>160:raise HTTPException(422,'Description too long')
    if photo.content_type not in ('image/jpeg','image/png','image/webp'):
        raise HTTPException(415,'Only JPEG, PNG and WEBP are supported')
    raw=await photo.read(8*1024*1024+1)
    if len(raw)>8*1024*1024:raise HTTPException(413,'Image exceeds 8 MB')
    try:
        im=ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
        im.load()
        if im.width*im.height>25_000_000:raise ValueError('Image too large')
        im=im.convert('RGB')
    except Exception:
        raise HTTPException(422,'Invalid or oversized image')
    model=get_model()
    try:
        results=model.predict(source=im,conf=.25,imgsz=960,verbose=False)
        boxes=results[0].boxes
        detections=[{'confidence':round(float(b.conf[0]),3),'bbox':[round(float(x),1) for x in b.xyxy[0].tolist()]} for b in boxes]
    except Exception as exc:
        raise HTTPException(500,f'Inference failed: {type(exc).__name__}')
    if not detections:
        return {'published':False,'detections':[],'message':'No camel detected by the model. No marker published. A negative result does not prove the road is clear.'}
    eid='PHOTO-'+uuid4().hex[:8].upper();t=now()
    im.thumbnail((1400,1400))
    im.save(UPLOAD_DIR/(eid+'.jpg'),format='JPEG',quality=83)
    e=dict(id=eid,road=road,lat=lat,lng=lng,severity='warning',confidence=max(d['confidence'] for d in detections),description=description or 'User-submitted photo · model detected camel',source='manual_photo',report_count=1,status='active',detected_at=t.isoformat(),expires_at=ttl(),image_url=f'/api/report-image/{eid}',verified=False)
    events[eid]=e
    save_events()
    return {'published':True,'event':e,'detections':detections,'message':'Provisional unverified report created'}

# Video report workflow: asynchronous processing, sampled-frame inference, and
# progressive provisional map markers. GPS is user supplied (not extracted from video).
VIDEO_DIR = BASE / 'uploads' / 'videos'
VIDEO_DIR.mkdir(parents=True, exist_ok=True)
video_jobs = {}
MAX_VIDEO_BYTES = 100 * 1024 * 1024
ALLOWED_VIDEO_EXT = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}
MODEL_LOCK = threading.Lock()

import math
SAMPLE_FPS = float(os.getenv('VIDEO_SAMPLE_FPS', '4'))   # frames analysed per second of video
VIDEO_IMGSZ = int(os.getenv('VIDEO_IMGSZ', '960'))        # 960 = more accurate on far camels, slower on CPU
CONFIRM_SAMPLES = int(os.getenv('VIDEO_CONFIRM', '2'))      # camel must appear in 3 analysed frames in a row (~0.75 s) before an alert
ALERT_CONF = float(os.getenv('VIDEO_ALERT_CONF', '0.35'))         # only boxes at or above this confidence count towards an alert
COOLDOWN_S = 10           # no new alert for the same video within 10 s
MERGE_KM = 0.5            # alerts closer than this join the same map event

def destination(lat, lng, heading_deg, km):
    """Point reached after driving `km` from (lat, lng) on a fixed heading."""
    r = 6371.0; d = km / r; b = math.radians(heading_deg)
    p1, l1 = math.radians(lat), math.radians(lng)
    p2 = math.asin(math.sin(p1)*math.cos(d) + math.cos(p1)*math.sin(d)*math.cos(b))
    l2 = l1 + math.atan2(math.sin(b)*math.sin(d)*math.cos(p1), math.cos(d) - math.sin(p1)*math.sin(p2))
    return math.degrees(p2), (math.degrees(l2) + 540) % 360 - 180

def km_between(a, b):
    p1, p2 = math.radians(a[0]), math.radians(b[0]); dp = p2 - p1; dl = math.radians(b[1] - a[1])
    x = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * 6371.0 * math.asin(math.sqrt(x))

def process_video_job(job_id, filepath, road, lat, lng, description, speed_kmh=100.0, heading=0.0):
    job = video_jobs[job_id]
    try:
        import cv2
        model = get_model()
        cap = cv2.VideoCapture(str(filepath))
        if not cap.isOpened():
            raise ValueError('Cannot decode video. Try an MP4 with H.264 encoding.')
        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        duration = total_frames / fps if total_frames else 0
        if duration > 180:
            raise ValueError('Video must be 3 minutes or shorter.')
        job['duration'] = round(duration, 2)
        stride = max(1, round(fps / SAMPLE_FPS))
        index, streak, heights, last_alert = 0, 0, [], -1e9
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            if index % stride == 0:
                timestamp = round(index / fps, 2)
                with MODEL_LOCK:
                    results = model.predict(source=frame, conf=.25, imgsz=VIDEO_IMGSZ, verbose=False)
                boxes = results[0].boxes
                detections = [{'confidence':round(float(b.conf[0]),3),
                               'bbox':[round(float(x),1) for x in b.xyxy[0].tolist()]}
                              for b in boxes]
                job['frames'].append({'time':timestamp,'detections':detections,
                                      'width':int(frame.shape[1]),'height':int(frame.shape[0])})
                job['detections_count'] += len(detections)
                strong = [d for d in detections if d['confidence'] >= ALERT_CONF]
                if strong:
                    streak += 1
                    heights.append(max(d['bbox'][3] - d['bbox'][1] for d in strong))
                    heights = heights[-6:]
                else:
                    streak, heights = 0, []
                if streak >= CONFIRM_SAMPLES and timestamp - last_alert >= COOLDOWN_S:
                    last_alert = timestamp
                    conf = max(d['confidence'] for d in strong)
                    high = len(heights) >= 3 and heights[-1] >= 1.3 * heights[0]
                    alat, alng = destination(lat, lng, heading, speed_kmh * timestamp / 3600)
                    event_id = None
                    for a in job['alerts']:
                        if km_between((a['lat'], a['lng']), (alat, alng)) <= MERGE_KM and a['event_id'] in events:
                            event_id = a['event_id']
                            e = events[event_id]
                            e['confidence'] = max(e['confidence'], conf)
                            e['expires_at'] = ttl()
                            break
                    if event_id is None:
                        event_id = 'VIDEO-' + uuid4().hex[:8].upper()
                        t = now()
                        events[event_id] = dict(id=event_id, road=road, lat=alat, lng=alng,
                            severity='critical' if high else 'warning', confidence=conf,
                            description=description or 'Dashcam video · camel detected',
                            source='manual_video', report_count=1, status='active',
                            detected_at=t.isoformat(), expires_at=ttl(),
                            video_url=f'/api/reports/video/{job_id}/file', verified=False,
                            video_job_id=job_id, video_time=timestamp)
                    save_events()
                    job['alerts'].append({'time':timestamp,'lat':alat,'lng':alng,'camels':len(strong),
                                          'confidence':conf,'level':'high' if high else 'normal',
                                          'event_id':event_id})
                    if job['event_id'] is None:
                        job['event_id'] = event_id
                job['processed_seconds'] = timestamp
            index += 1
            if total_frames:
                job['progress'] = min(99, round(index / total_frames * 100))
        cap.release()
        job['processed_seconds'] = job['duration']
        job['status'] = 'complete'
        job['progress'] = 100
        job['message'] = (f"{len(job['alerts'])} alert(s) published; human verification recommended."
                          if job['alerts'] else 'No confirmed camel in the analysed frames; no map marker published.')
    except Exception as exc:
        job['status'] = 'error'
        job['message'] = str(exc)[:240]
    finally:
        job['finished_at'] = now().isoformat()

@app.post('/api/reports/video', status_code=202)
async def submit_video_report(video: UploadFile = File(...), road: str = Form(...),
                              lat: float = Form(...), lng: float = Form(...),
                              description: str = Form(''), speed: float = Form(100.0),
                              heading: float = Form(0.0)):
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        raise HTTPException(422,'Invalid coordinates')
    if not (2 <= len(road.strip()) <= 120):
        raise HTTPException(422,'Road name must be 2–120 characters')
    if len(description) > 160:
        raise HTTPException(422,'Description too long')
    if not (0 < speed <= 200):
        raise HTTPException(422,'Speed must be between 1 and 200 km/h')
    heading = heading % 360
    suffix = Path(video.filename or '').suffix.lower()
    if suffix not in ALLOWED_VIDEO_EXT:
        raise HTTPException(415,'Use MP4, MOV, AVI, MKV or WEBM')
    # Fail fast rather than silently accepting reports when weights are missing.
    get_model()
    job_id = uuid4().hex[:12]
    path = VIDEO_DIR / (job_id + suffix)
    size = 0
    try:
        with path.open('wb') as out:
            while chunk := await video.read(1024*1024):
                size += len(chunk)
                if size > MAX_VIDEO_BYTES:
                    raise HTTPException(413,'Video exceeds 100 MB')
                out.write(chunk)
    except Exception:
        path.unlink(missing_ok=True)
        raise
    if not size:
        path.unlink(missing_ok=True)
        raise HTTPException(422,'Empty video')
    video_jobs[job_id] = dict(id=job_id,status='processing',progress=0,
        processed_seconds=0,duration=0,frames=[],detections_count=0,
        event_id=None,alerts=[],message='Analyzing sampled video frames…',
        route=dict(lat=lat,lng=lng,heading=heading,speed_kmh=speed),
        file_name=path.name,created_at=now().isoformat())
    threading.Thread(target=process_video_job,
        args=(job_id,path,road.strip(),lat,lng,description,speed,heading),daemon=True).start()
    return {'job_id':job_id,'status':'processing'}

@app.get('/api/reports/video/{job_id}')
def video_job_status(job_id: str):
    if job_id not in video_jobs:
        raise HTTPException(404,'Video job not found')
    return video_jobs[job_id]

@app.get('/api/reports/video/{job_id}/file')
def video_job_file(job_id: str):
    job = video_jobs.get(job_id)
    if not job:
        raise HTTPException(404,'Video job not found')
    path = VIDEO_DIR / job['file_name']
    return FileResponse(path,media_type={
        '.mp4':'video/mp4','.webm':'video/webm','.mov':'video/quicktime',
        '.avi':'video/x-msvideo','.mkv':'video/x-matroska'
    }.get(path.suffix,'application/octet-stream'))