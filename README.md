# هوبال | Hobal — video reporting prototype

A FastAPI + Google Maps dashboard for **uploaded dashcam video**. This is a research/demo prototype, not a deployed safety service.

## Setup (Windows PowerShell)
1. Open the `camelwatch_prototype` folder in VS Code.
2. Create `.env` (copy `.env.example`) and set `GOOGLE_MAPS_API_KEY=...`.
3. Copy your trained YOLO weights to `models/best_v3.pt` (the training notebook alone is not weights).
4. Run:

```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

5. Visit http://127.0.0.1:8000

Enable **Maps JavaScript API** and billing in Google Cloud; configure HTTP referrer restrictions for localhost:8000 and 127.0.0.1:8000. Do not publish unrestricted keys.

## How the video demo works
- Select **Report a camel** and upload a video (MP4/MOV/AVI/MKV/WEBM, max 100 MB and 3 minutes).
- Supply the road name and location (or allow browser GPS); **the video does not provide geolocation automatically**.
- FastAPI saves the file and starts a background inference thread.
- OpenCV reads the uploaded file; YOLO analyzes **about one frame per second**. The frontend polls the job status every second, draws bounding boxes over the playing video for sampled frames, and displays a map marker as soon as a detection is reported.
- The marker is **provisional** and unverified. If there are no detections in sampled frames, no marker is published.
- The main hazard map and the adjacent map both reflect provisional video reports. The data and jobs are held in memory and disappear after server restart; files persist locally in `uploads/`.

## API
- `POST /api/reports/video` — multipart `video`, `road`, `lat`, `lng`, `description`
- `GET /api/reports/video/{job_id}` — analysis progress, sampled boxes, event ID
- `GET /api/reports/video/{job_id}/file` — uploaded video
- `GET /api/model/status` — whether weights are present
- `GET /api/hazards` — current events
- `GET /docs` — Swagger UI

## Important limitations
- This is **near-real-time map feedback while analyzing a pre-recorded upload**, not live in-vehicle camera streaming.
- Inference runs on the server and may be slower than video playback, especially on CPU. The video itself can be played independently.
- GPS refers to the **reporter's entered position**, not necessarily the camel's position.
- Browser playback is most reliable for MP4 (H.264) or WebM; MOV/MKV/AVI may be accepted by OpenCV but not playable in-browser.
- YOLO detections are only as accurate as the weights and data used for training. No automatic verification of road position, distance, direction, or false positives.
- There is no Waze/Google Maps consumer-app alert integration, automatic expiry confirmation, authentication, rate limits, or durable database.
- **Do not upload while driving.** For real deployment, add moderation, privacy safeguards, deletion policies, video scanning, authentication, and robust job queue/storage.

## Live drive mode (التتبع المباشر)
- Fill start lat/lng (or click the live map), speed and driving direction, choose a video, press Analyse.
- The video plays while the model analyses it (~4 frames/s). If the model falls behind, the video waits ("Analysing ahead…") so nothing appears before it is detected.
- A car 🚙 moves on the map with the video (speed × time along the chosen direction).
- A camel needs 3 analysed frames in a row (conf ≥ 0.4) → 🐪 drops on the map at the car's position at that second, red warning on the video, beep + spoken warning.
- No Google Maps key? The live map falls back to OpenStreetMap automatically.
- Settings (in `.env`): `VIDEO_SAMPLE_FPS=4`, `VIDEO_IMGSZ=640` (960 = better on far camels but slower on CPU).
