# 🐪 Camel Detection on Highways

**Every car on the road becomes an eye for the cars behind it.**

A system that detects stray camels on highways, **especially at night**, from a car camera (dashcam or phone). It warns the driver with a sound alert and sends the camels' location to a shared map, so every car coming on the same road is warned before it gets there.

Group 6 · Unit 7 Final Project

---

## Problem
Camel–vehicle collisions on Saudi highways are very dangerous because of the camel's size. The risk is highest at night, when drivers often see the camel only when it is already close.

## Solution
1. **Detect:** a YOLO model finds camels in dashcam video, including small, far ones.
2. **Alert:** the driver gets a sound and visual warning.
3. **Share:** the camels' location is sent to a shared map, and every car behind gets an alert. If more than one car confirms the camels, the alert gets stronger; if no car confirms it for a while, it disappears.

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
- **Horizon boost** for video: the model runs once on the full frame and once on a zoomed horizon strip, to catch far camels earlier

## Results (test set)
| Test set | Precision | Recall | mAP50 |
|---|---|---|---|
| All (48) | 0.863 | 0.740 | 0.781 |
| **Night (24)** | 0.862 | **0.926** | **0.942** |
| Day (24) | 0.847 | 0.597 | 0.664 |

We focus on **Recall**: missing a camel is much worse than an extra alert.

---

## Files
| File | Description |
|---|---|
| `camel-detection-training.ipynb` | Training and evaluation notebook (Kaggle) |
| `best_v3.pt` | Trained model weights |
| `app.py` | Streamlit app (driver page + shared map) |
| `requirements.txt`, `packages.txt` | Required libraries |

## Run locally
```bash
pip install -r requirements.txt
streamlit run app.py
```

**Live demo:** [Streamlit link] · **Demo video:** [video link]

> Note: the map in the demo is a simulation on the Riyadh–Taif road, because the videos have no GPS. In a real app the location comes from the car's GPS.

## Next steps
- Fixed and thermal cameras at high-risk spots
- Sending alerts to Waze and Google Maps
- More daytime road images to improve day detection
