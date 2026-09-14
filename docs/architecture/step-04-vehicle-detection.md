# Step 4 -- Vehicle Detection & Multi-Object Tracking

## Detection Pipeline Architecture

```
Sentinel RTSP (TCP)
       |
  RTSPStreamReader   (Step 3 -- unchanged)
       |
  [frame, {media_pts_ms, local_receive_monotonic, frame_sequence}]
       |
  FrameSelector? -- NO, every frame goes to tracker update
       |
  [every N frames] --> VehicleDetector (YOLOv8n)
       |
  List[Detection]  {vehicle_class, confidence, bbox, media_pts_ms}
       |
  VehicleTracker (IoU matching)
       |
  List[VehicleTrack]  {track_id, first_seen_pts_ms, last_seen_pts_ms, ...}
       |
  FrameSelector (quality scoring per confirmed track)
       |
  Best candidate frames --> data/snapshots/<camera_id>/
       |
  DetectionEvent --> data/detections/<camera_id>/vehicle_detections.jsonl
       |
  Track summaries --> data/detections/<camera_id>/tracks.json
```

**SCOPE BOUNDARY**: Watchlist matching is NOT part of Step 4.
Best-frame collection exists only to prepare input for Step 5 (ANPR/LPR).

---

## Timing Model (Critical)

| Field | Source | Purpose |
| :--- | :--- | :--- |
| `media_pts_ms` | `cap.get(cv2.CAP_PROP_POS_MSEC)` | Authoritative video timeline |
| `local_receive_monotonic` | `time.monotonic()` | Pipeline latency diagnostics only |
| `first_seen_pts_ms` | First container PTS when track was created | Track start time in video |
| `last_seen_pts_ms` | Most recent container PTS for track | Track end time in video |

`CAP_PROP_FPS` is **never** used for timing.

---

## Model Selection

**YOLOv8n (nano)** was selected for this phase because:
- Pre-trained on MS-COCO (80 classes) supporting: `car`, `truck`, `bus`, `motorcycle`, `bicycle`
- Smallest YOLO variant (~6 MB) -- suitable for CPU-only deployment on police infrastructure
- Single-file weights auto-downloaded on first run
- Modular: swap to `yolov8s.pt`, `yolov8m.pt`, or YOLO11 via `--model` flag with no code changes
- 35 ms inference per frame on CPU (~28 FPS theoretical, ~12 FPS actual with RTSP I/O)

---

## PTS Discontinuity and Stream Reset

When a PTS backward jump or gap >10 seconds is detected, the tracker is reset:
- All active tracks are terminated (preserved in history for export)
- New tracks start fresh from the next valid detection
- This prevents "ghost tracks" spanning a stream loop boundary
