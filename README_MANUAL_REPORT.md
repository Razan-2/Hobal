# Manual driver photo reports

Run `pip install -r requirements.txt` and `uvicorn main:app --reload`. Copy `.env.example` to `.env` and add your Google Maps key.

**Required for image inference:** Download the trained `best_v3.pt` weights from Kaggle notebook output (`camel_v3_results/best_v3.pt`), then put them at `models/best_v3.pt`. The provided `.ipynb` contains training code only. Check `GET /api/model/status`.

The new Report a camel section uploads JPEG/PNG/WEBP photos (8 MB max), road name and coordinates to `POST /api/reports/image`. Ultralytics YOLO analyzes the photo. If camel boxes are detected, a provisional unverified hazard is added to the in-memory map feed and an image is available at `/api/report-image/{id}`. No weights -> HTTP 503; no detections -> no map marker. No video inference, GPS road matching, moderation, automatic Waze/Google Maps alerts or persistent database yet. Do not use for real-world safety decisions. Upload only while safely stopped.
