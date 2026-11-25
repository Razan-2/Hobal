"""Camel Detection: Streamlit demo.

صفحتين:
  🚚 السائق: فيديو داش كام، كشف الإبل، صوت تحذير، وإرسال الموقع للخريطة.
  🗺️ الخريطة المشتركة: أي جهاز ثاني يفتحها يشوف التنبيهات اللي قدامه على نفس الطريق.

التشغيل:  pip install -r requirements.txt  ثم  streamlit run app.py
ضعوا best_v3.pt بجانب app.py. (اختياري: alert.mp3 بصوتكم «إبل على الطريق قدامك».)
"""
import io
import math
import os
import tempfile
import threading
import time
import wave

import cv2
import numpy as np
import pandas as pd
import streamlit as st
from ultralytics import YOLO

st.set_page_config(page_title="Camel Detection", page_icon="🐪", layout="wide")
st.markdown(
    """
    <style>
    .block-container {direction: rtl; text-align: right;}
    .alert {border-radius: 14px; padding: 16px 20px; font-size: 24px; font-weight: 700; margin-bottom: 8px;}
    .green  {background: #3FAE7A; color: #0F1A2B;}
    .yellow {background: #F2C94C; color: #0F1A2B;}
    .red    {background: #E5533D; color: #FCFAF5;}
    .none   {background: #3A3631; color: #E3D6C2;}
    </style>
    """,
    unsafe_allow_html=True,
)

# ---------------- the road: Riyadh -> Taif (straight line, for the demo) ----------------
RIYADH = (24.7136, 46.6753)
TAIF = (21.2703, 40.4158)
ROAD_KM = 780


def point_at(km):
    t = min(max(km / ROAD_KM, 0), 1)
    return RIYADH[0] + (TAIF[0] - RIYADH[0]) * t, RIYADH[1] + (TAIF[1] - RIYADH[1]) * t


# ---------------- shared alerts (one store for every visitor of the app) ----------------
@st.cache_resource
def shared():
    return {"alerts": [], "history": [], "lock": threading.Lock()}


DB = shared()
MERGE_KM = 3          # detections closer than this are the same herd


def report_camels(km, n_camels):
    """A car confirmed camels at road position km: add a new alert or strengthen an old one."""
    now = time.time()
    with DB["lock"]:
        for a in DB["alerts"]:
            if abs(a["km"] - km) <= MERGE_KM:
                a["cars"] += 1
                a["last"] = now
                a["camels"] = max(a["camels"], n_camels)
                break
        else:
            DB["alerts"].append(dict(km=km, cars=1, camels=n_camels, first=now, last=now))
        DB["history"].append(dict(km=km, time=now))


def active_alerts(ttl_min):
    now = time.time()
    with DB["lock"]:
        DB["alerts"] = [a for a in DB["alerts"] if now - a["last"] < ttl_min * 60]
        return [dict(a) for a in DB["alerts"]]


# ---------------- sound ----------------
@st.cache_data
def beep_wav():
    sr = 22050
    t = np.linspace(0, 0.25, int(sr * 0.25), False)
    tone = np.concatenate([np.sin(2 * np.pi * 880 * t), np.zeros(int(sr * 0.1))] * 3)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((tone * 0.6 * 32767).astype(np.int16).tobytes())
    return buf.getvalue()


def play_alert(box):
    if os.path.exists("alert.mp3"):
        box.audio(open("alert.mp3", "rb").read(), format="audio/mp3", autoplay=True)
    else:
        box.audio(beep_wav(), format="audio/wav", autoplay=True)


# ---------------- detection helpers ----------------
LEVELS = {
    0: ("none", "لا يوجد إبل"),
    1: ("green", "🟢 جمل بعيد"),
    2: ("yellow", "🟡 انتبه: جمل قريب من الطريق"),
    3: ("red", "🔴 إبل على الطريق قدامك، خفّف السرعة"),
}
COLORS_BGR = {1: (122, 174, 63), 2: (76, 201, 242), 3: (61, 83, 229)}


def road_zone(w, h):
    return np.array([[w * 0.10, h], [w * 0.90, h], [w * 0.58, h * 0.45], [w * 0.42, h * 0.45]], np.int32)


def level_of(box, w, h, zone):
    x1, y1, x2, y2 = box
    on_road = cv2.pointPolygonTest(zone, (float((x1 + x2) / 2), float(y2)), False) >= 0
    size = (y2 - y1) / h
    if on_road and size > 0.25:
        return 3
    if on_road or size > 0.15:
        return 2
    return 1


@st.cache_resource
def load_model(path):
    return YOLO(path)


# ---------------- pages ----------------
st.sidebar.title("🐪 Camel Detection")
page = st.sidebar.radio("الصفحة", ["🚚 السائق (داش كام)", "🗺️ الخريطة المشتركة"])
ttl = st.sidebar.slider("التنبيه يختفي بعد (دقائق) إذا ما أحد أكده", 1, 30, 10)


def driver_page():
    st.header("🚚 السائق: داش كام")
    st.caption("الموديل يكشف الإبل، ينبّه السائق بصوت، ويرسل الموقع للخريطة عشان اللي وراه يتنبّهون.")
    with st.sidebar:
        st.markdown("---")
        model_path = st.text_input("ملف الموديل", "best_v3.pt")
        conf = st.slider("Confidence", 0.05, 0.80, 0.25, 0.05)
        imgsz = st.select_slider("حجم الصورة", options=[640, 960], value=640)
        skip = st.slider("تحليل فريم من كل", 1, 5, 3, help="أكبر = أسرع على جهاز بدون GPU")
        confirm = st.slider("تأكيد الجمل بعد (فريمات)", 1, 10, 5)
        my_km = st.slider("موقع السيارة على طريق الرياض–الطائف (كم)", 0, ROAD_KM, 120)

    if not os.path.exists(model_path):
        st.warning(f"ما لقيت `{model_path}`. حطوا best_v3.pt بجانب app.py.")
        return
    model = load_model(model_path)

    video = st.file_uploader("ارفع فيديو داش كام", type=["mp4", "mov", "avi", "mkv"])
    left, right = st.columns([2.2, 1])
    with left:
        frame_box = st.empty()
        progress = st.progress(0.0)
    with right:
        alert_box = st.empty()
        sound_box = st.empty()
        sent_box = st.empty()
    alert_box.markdown(f"<div class='alert none'>{LEVELS[0][1]}</div>", unsafe_allow_html=True)

    if video is None or not st.button("▶️ ابدأ", type="primary"):
        return

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(video.name)[1])
    tmp.write(video.read()); tmp.close()
    cap = cv2.VideoCapture(tmp.name)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 1
    seen, reported, warned = {}, False, False
    model.predictor = None                     # fresh tracker for each video
    i = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        i += 1
        if i % skip:
            continue
        h, w = frame.shape[:2]
        zone = road_zone(w, h)
        res = model.track(frame, imgsz=imgsz, conf=conf, persist=True, tracker="bytetrack.yaml", verbose=False)[0]

        worst, confirmed_ids = 0, set()
        if res.boxes is not None and len(res.boxes):
            ids = res.boxes.id.int().tolist() if res.boxes.id is not None else [None] * len(res.boxes)
            for box, tid in zip(res.boxes.xyxy.cpu().numpy(), ids):
                key = tid if tid is not None else -1
                seen[key] = seen.get(key, 0) + 1
                ok_id = seen[key] >= confirm
                lv = level_of(box, w, h, zone) if ok_id else 1
                if ok_id:
                    worst = max(worst, lv); confirmed_ids.add(key)
                x1, y1, x2, y2 = box.astype(int)
                color = COLORS_BGR[lv] if ok_id else (180, 180, 180)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 3)
                cv2.putText(frame, f"camel #{tid}" if tid is not None else "camel", (x1, max(20, y1 - 8)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        if confirmed_ids and not reported:      # send once per video
            report_camels(my_km + 1, len(confirmed_ids))
            reported = True
            sent_box.success("📡 انرسل موقع الإبل للخريطة، والسيارات اللي وراك بيوصلها تنبيه.")
        if worst >= 2 and not warned:
            play_alert(sound_box)
            warned = True

        frame_box.image(frame[:, :, ::-1], use_container_width=True)
        css, text = LEVELS[worst]
        alert_box.markdown(f"<div class='alert {css}'>{text}</div>", unsafe_allow_html=True)
        progress.progress(min(1.0, i / total))

    cap.release(); os.unlink(tmp.name)
    progress.progress(1.0)
    st.info("خلص الفيديو. افتحوا صفحة 🗺️ الخريطة المشتركة من جهاز ثاني وشوفوا التنبيه.")


def map_page():
    st.header("🗺️ الخريطة المشتركة")
    st.caption("افتحوها على جوال ثاني: هذا السائق اللي جاي ورا على نفس الطريق.")
    my_km = st.sidebar.slider("موقعي على طريق الرياض–الطائف (كم)", 0, ROAD_KM, 60)

    @st.fragment(run_every="3s")
    def live():
        alerts = active_alerts(ttl)
        ahead = sorted([a for a in alerts if a["km"] >= my_km], key=lambda a: a["km"])
        if ahead:
            a = ahead[0]
            dist = a["km"] - my_km
            strong = a["cars"] >= 2
            css = "red" if strong else "yellow"
            word = f"مؤكد من {a['cars']} سيارات" if strong else "بلّغت عنه سيارة وحدة"
            mins = int((time.time() - a["last"]) // 60)
            st.markdown(f"<div class='alert {css}'>⚠️ إبل على الطريق بعد {dist:.0f} كم · {word} · قبل {mins} دقيقة</div>",
                        unsafe_allow_html=True)
        else:
            st.markdown("<div class='alert green'>✅ الطريق قدامك سالك</div>", unsafe_allow_html=True)

        me = point_at(my_km)
        pts = [dict(lat=me[0], lon=me[1], color="#3B82C4", size=900)]
        for a in alerts:
            lat, lon = point_at(a["km"])
            pts.append(dict(lat=lat, lon=lon, color="#E5533D" if a["cars"] >= 2 else "#F2C94C",
                            size=1500 + 700 * a["cars"]))
        st.map(pd.DataFrame(pts), latitude="lat", longitude="lon", color="color", size="size", zoom=6)
        st.caption("🔵 أنت   🟡 تنبيه من سيارة وحدة   🔴 تنبيه مؤكد من أكثر من سيارة")

        if DB["history"]:
            with st.expander("📊 سجل البلاغات (أساس خريطة المناطق الخطرة)"):
                hist = pd.DataFrame(DB["history"])
                hist["الوقت"] = pd.to_datetime(hist["time"], unit="s").dt.strftime("%H:%M:%S")
                hist["الكيلو"] = hist["km"]
                st.dataframe(hist[["الكيلو", "الوقت"]], hide_index=True)

    live()
    if st.sidebar.button("🧹 مسح كل التنبيهات"):
        with DB["lock"]:
            DB["alerts"].clear(); DB["history"].clear()


if page.startswith("🚚"):
    driver_page()
else:
    map_page()
