# 🐪 Hobal: Camel Detection on Highways

**Every car on the road becomes an eye for the cars behind it.**

Hobal detects stray camels on highways, **especially at night**, from a car camera (dashcam or phone). It warns the driver, and sends the camels' location to a shared map so every car coming on the same road is warned before it gets there.

Group 6 · Unit 7 Final Project

---

## Problem
Camel–vehicle collisions on Saudi highways are very dangerous because of the camel's size. The risk is highest at night, when drivers often see the camel only when it is already close.

## Solution
1. **Detect:** a YOLO model finds camels in dashcam images and video, including small, far ones.
2. **Alert:** the driver gets a sound and visual warning with a risk level (far / near the road / on the road).
3. **Share:** the camels' location is sent to a shared map, and every car behind gets an alert. If more than one car reports the same herd, the alert is marked as confirmed; if no car confirms it for 10 minutes, it disappears.

---

## Dataset
| Split | Images |
|---|---|
| Train | 959 |
| Valid | 188 |
| Test | 48 (24 night + 24 day) |

Sources: public camel images (Kaggle and Roboflow) plus night dashcam frames collected by the team. One class: `camel`.

## Model
- **YOLO11s**, image size **960**, trained on **Kaggle** (T4 GPU)
- On-the-fly augmentation: brightness ±50%, flips, scale, mosaic
- **Horizon boost:** the model runs once on the full frame and once on a zoomed horizon strip, to catch far camels earlier

## Results (test set)
| Test set | Precision | Recall | mAP50 |
|---|---|---|---|
| All (48) | 0.863 | 0.740 | 0.781 |
| **Night (24)** | 0.862 | **0.926** | **0.942** |
| Day (24) | 0.847 | 0.597 | 0.664 |

We focus on **Recall**: missing a camel is much worse than an extra alert.

---

## API
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Web interface: upload a photo or video, see the alert, and the shared map |
| `POST` | `/detect` | Photo → detected camels, risk level, annotated image |
| `POST` | `/detect-video` | Video → second the first camel appears, annotated video |
| `POST` | `/report` | A car reports camels at a location (`lat`, `lon`, `camels`) |
| `GET` | `/alerts` | Active alerts, sorted by distance from `lat`, `lon` |
| `DELETE` | `/alerts` | Clear all alerts |
| `GET` | `/docs` | Interactive API documentation |

## Files
| File | Description |
|---|---|
| `app.py` | FastAPI app: detection API + web interface |
| `best_v3.pt` | Trained model weights |
| `camel-detection-training.ipynb` | Training and evaluation notebook (Kaggle) |
| `requirements.txt` | Python libraries |
| `Dockerfile` | Container for deployment (Hugging Face Spaces or Render) |

## Run locally
```bash
pip install -r requirements.txt
uvicorn app:app --reload
```
Open `http://127.0.0.1:8000` for the interface, or `http://127.0.0.1:8000/docs` to try the API.

**Live demo:** [deployment link] · **Demo video:** [video link]

> Note: in the demo, the car's location is typed in or taken from the phone's GPS ("📍" button). Real integration with Waze and Google Maps is a next step.

## Next steps
- Fixed and thermal cameras at high-risk spots
- Sending alerts to Waze and Google Maps
- A heat map of high-risk places and times for the road authority
- More daytime road images to improve day detection
