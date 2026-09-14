# Gujarat Unified CCTV Intelligence & Federation Platform

> **Gujarat Police Innovation Hackathon 2026**  
> Foundational Streaming, AI Vehicle Analytics & License Plate Localization Layer (Steps 1–5)

---

## 1. Project Overview

This repository implements the resilient CCTV connectivity, catalogue discovery, video frame ingestion, vehicle detection/tracking, and license plate region localization for the **Gujarat Unified CCTV Intelligence & Federation Platform**.

The platform adheres strictly to the **Sentinel Sandbox** constraints:
- Feeds are live RTP/RTSP/HLS streams (no seeking, no direct file download).
- RTSP transport is strictly forced over **TCP** (`rtsp_transport;tcp`).
- Video timing is anchored on **media container PTS** (`cap.get(cv2.CAP_PROP_POS_MSEC)`), never on arrival clocks or `CAP_PROP_FPS`.
- Automatic resilience via bounded **exponential backoff** ($2\text{s} \to 4\text{s} \to 8\text{s} \to 16\text{s} \to 30\text{s}$).
- Safe handling of stream loops, timeline resets, and PTS discontinuities.
- Zero-bypass security: credentials and secrets are controlled via `.env` and masked in logs.
- Strict phase separation: Step 5 isolates license plate region localization from Step 6 ANPR/OCR text recognition.

---

## 2. Directory Structure

```
cctv-platform/
│
├── README.md
├── .gitignore
├── .env.example
├── .env
├── requirements.txt
├── pytest.ini
│
├── config/
│   ├── settings.example.yaml
│   └── settings.yaml
│
├── data/
│   ├── catalogue/
│   │   ├── raw/
│   │   └── normalized/
│   ├── detections/
│   │   └── <camera_id>/
│   │       ├── vehicle_detections.jsonl
│   │       ├── tracks.json
│   │       ├── plate_candidates.jsonl
│   │       └── plate_summary.json
│   └── snapshots/
│       └── <camera_id>/
│           ├── plates/
│           └── plates_processed/
│               ├── grayscale/
│               ├── upscaled/
│               ├── contrast/
│               ├── sharpened/
│               └── denoised/
│
├── docs/
│   ├── architecture/
│   │   ├── step-01-03-connectivity.md
│   │   ├── step-04-vehicle-detection.md
│   │   └── step-05-best-frame-plate-detection.md
│   ├── api/
│   │   └── sentinel-catalogue.md
│   └── troubleshooting/
│       └── connectivity.md
│
├── logs/
│
├── scripts/
│   ├── test_catalogue_access.py
│   ├── list_cameras.py
│   ├── test_camera.py
│   ├── run_vehicle_detection.py
│   └── run_plate_detection.py
│
├── src/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── common/
│   │   ├── __init__.py
│   │   ├── logging.py
│   │   └── time.py
│   │
│   ├── catalogue/
│   │   ├── __init__.py
│   │   ├── client.py
│   │   ├── parser.py
│   │   ├── models.py
│   │   ├── validator.py
│   │   └── sync.py
│   │
│   ├── streaming/
│   │   ├── __init__.py
│   │   ├── rtsp.py
│   │   ├── reconnect.py
│   │   └── health.py
│   │
│   └── ai/
│       ├── __init__.py
│       ├── schemas.py
│       ├── detector.py
│       ├── tracker.py
│       ├── frame_selector.py
│       ├── plate_detector.py
│       ├── plate_quality.py
│       ├── plate_preprocessor.py
│       └── candidate_manager.py
│
└── tests/
    ├── test_catalogue.py
    ├── test_validator.py
    ├── test_stream_config.py
    ├── test_health.py
    ├── test_vehicle_detection.py
    └── test_plate_detection.py
```

---

## 3. Installation & Usage

### Setup Commands (PowerShell)
```powershell
# 1. Install required Python packages
pip install -r requirements.txt

# 2. Run full unit test suite (74 tests)
python -m pytest -v
```

---

## 4. Execution Commands

### Step 1–3: RTSP Stream Validation
```powershell
# Validate 100 frames with container PTS logging
python scripts/test_camera.py --camera-id cam01 --frames 100 --headless
```

### Step 6: ANPR / OCR + Multi-Frame Consensus

```powershell
# Run OCR Sanity Test (Independent verification)
python scripts/test_ocr.py --generate-synthetic

# Run ANPR Pipeline with EasyOCR, candidate eligibility diagnostics, and debug outputs
python scripts/run_anpr.py --camera-id cam01 --ocr-engine easyocr --debug --no-display

# Build / curate evaluation dataset from Step 5 plate crops
python scripts/build_anpr_dataset.py --source data/snapshots/cam01/plates/ --split development

# Evaluate ANPR against Development Dataset (36 samples, condition & failure breakdown)
python scripts/evaluate_anpr.py --dataset data/evaluation/anpr/development

# Run Preprocessing Ablation Comparison (original, grayscale, upscaled, contrast, sharpened)
python scripts/evaluate_anpr.py --dataset data/evaluation/anpr/development --ablation

# Run Confidence Threshold Tradeoff Analysis
python scripts/evaluate_anpr.py --dataset data/evaluation/anpr/development --threshold-analysis

# Evaluate Held-Out Dataset (unbiased final evaluation)
python scripts/evaluate_anpr.py --dataset data/evaluation/anpr/heldout
```

### Step 7: Observed Vehicle Database

```powershell
# Build / ingest Step 6 results into Observed Vehicle Database
python scripts/build_observed_vehicle_db.py --input data/anpr/cam01/consensus/anpr_consensus.json

# Ingest multi-camera consensus outputs:
python scripts/build_observed_vehicle_db.py \
    --input data/anpr/cam01/consensus/anpr_consensus.json \
    --input data/anpr/cam07/consensus/anpr_consensus.json

# Query observed vehicle profile & cross-camera timeline
python scripts/query_observed_vehicle.py --registration GJ01AB1234

# List all observed vehicles
python scripts/query_observed_vehicle.py --list

# Show network-wide CCTV observation statistics
python scripts/query_observed_vehicle.py --stats

# Inspect vehicle track evidence
python scripts/query_observed_vehicle.py --track TRK-0001
```

### Step 8: Representative Synthetic Watchlist

```powershell
# Build synthetic watchlist from Step 7 observed vehicles (matching + non-matching records)
python scripts/build_synthetic_watchlist.py \
    --observed data/observed/vehicles/vehicles.json \
    --match-count 2 \
    --nonmatch-count 5 \
    --seed 42 \
    --output data/watchlist/vehicles/watchlist.json

# Validate watchlist format integrity and expected demonstration match coverage
python scripts/validate_watchlist.py \
    --watchlist data/watchlist/vehicles/watchlist.json \
    --observed data/observed/vehicles/vehicles.json

# Query vehicle watchlist record
python scripts/query_watchlist.py --registration GJ01AB1234

# List all watchlist records
python scripts/query_watchlist.py --list

# Show synthetic watchlist category and priority statistics
python scripts/query_watchlist.py --stats
```

### Step 9: Real-Time Watchlist Matching

```powershell
# Run real-time watchlist matching on Step 7 observations
python scripts/run_watchlist_matching.py \
    --observations data/observed/vehicles/observations.jsonl \
    --watchlist data/watchlist/vehicles/watchlist.json

# Test matching on a single plate
python scripts/test_watchlist_match.py --plate GJ01AB1234

# Test fuzzy review on single-character OCR discrepancy
python scripts/test_watchlist_match.py --plate GJ01A81234 --fuzzy
```

### Step 10: Kafka Event Pipeline

```powershell
# Inspect Kafka topics, connectivity, and message queues
python scripts/inspect_topics.py

# Publish a test ANPR event into the Kafka bus
python scripts/publish_test_event.py --plate GJ01AB1234

# Publish duplicate event to verify idempotency
python scripts/publish_test_event.py --plate GJ01AB1234 --event-id EVT-DUP-001

# Start end-to-end event streaming pipeline
python scripts/start_event_pipeline.py \
    --observations data/observed/vehicles/observations.jsonl \
    --watchlist data/watchlist/vehicles/watchlist.json

# Consume and inspect messages from a specific topic
python scripts/consume_test_events.py --topic alerts
python scripts/consume_test_events.py --topic watchlist.matches
```

### Step 11: Cross-Camera Vehicle Correlation & Journey Reconstruction

```powershell
# Rebuild vehicle journeys for all observed vehicles
python scripts/build_vehicle_journey.py --all

# Include PROBABLE OCR observations in journey build
python scripts/build_vehicle_journey.py --all --include-probable

# Query cross-camera observation history for a designated vehicle
python scripts/query_vehicle_journey.py --registration GJ01AB1234

# Validate journey integrity and Common-Clock Rule adherence
python scripts/validate_journey.py --registration GJ01AB1234
```

### Step 11.1: Cross-Camera Journey Hardening

```powershell
# Generate observation dataset statistics report
python scripts/report_observation_dataset.py

# Find vehicles observed on multiple cameras (ranked by coverage)
python scripts/find_multicamera_vehicles.py --include-probable

# Enhanced validation with 12 integrity checks (PTS, source time, distance_status, limitations)
python scripts/validate_journey.py GJ01AB1234
```

**Key Hardening Outputs:**
- `data/catalogue/normalized/camera_metadata_report.json` — field availability across all 30 cameras
- `data/catalogue/enrichment/camera_coordinates.json` — validated coordinate enrichment schema
- `data/observed/reports/dataset_statistics.json` — dataset statistics (vehicles, coverage, quality)
- `data/journeys/reports/camera_transition_statistics.json` — camera adjacency graph

**Known Limitations (disclosed transparently):**
- Source/calendar time: `NOT_RESOLVED` — Sentinel catalogue contains only `id` and `name` per camera (no wall_time, server_epoch, or timezone)
- Camera coordinates: `UNAVAILABLE` — all 30 cameras have `latitude=null, longitude=null` in the catalogue
- Dataset size: 3 observations across 2 cameras (expand by running ANPR pipeline against more cameras)

> See [docs/architecture/step-11-1-journey-hardening.md](docs/architecture/step-11-1-journey-hardening.md) for full architecture details.

### Step 4: Vehicle Detection & Tracking
```powershell
# Run vehicle detection on cam01 stream
python scripts/run_vehicle_detection.py --camera-id cam01 --frames 500 --no-display
```

### Step 5: Best-Frame Selection & License Plate Detection

#### Offline Mode (Process saved Step 4 track data without reopening camera)
```powershell
python scripts/run_plate_detection.py --camera-id cam01 --tracks data/detections/cam01/tracks.json --no-display
```

#### Live Stream Mode (Run vehicle tracking + plate detection inline)
```powershell
python scripts/run_plate_detection.py --camera-id cam01 --frames 500 --no-display
```

---

## 5. Output Data Schema

### `data/detections/cam01/plate_candidates.jsonl`
```json
{
  "camera_id": "cam01",
  "track_id": "TRK-0001",
  "frame_id": 24,
  "pts_ms": 1520.0,
  "has_valid_pts": true,
  "local_receive_monotonic": 1199285.156,
  "plate_bbox": [254, 672, 282, 681],
  "plate_confidence": 0.8056,
  "detector_version": "contour_v1",
  "plate_quality_score": 0.913,
  "plate_width": 28,
  "plate_height": 9,
  "sharpness_score": 1.0,
  "brightness_score": 0.6519,
  "contrast_score": 1.0,
  "combined_score": 0.8593,
  "original_crop_path": "data/snapshots/cam01/plates/cam01_TRK-0001_frame000024_pts1520_plate10.jpg",
  "processed_crop_paths": {
    "grayscale": "data/snapshots/cam01/plates_processed/grayscale/cam01_TRK-0001_frame000024_pts1520_plate10.jpg",
    "upscaled": "data/snapshots/cam01/plates_processed/upscaled/cam01_TRK-0001_frame000024_pts1520_plate10.jpg",
    "contrast": "data/snapshots/cam01/plates_processed/contrast/cam01_TRK-0001_frame000024_pts1520_plate10.jpg",
    "sharpened": "data/snapshots/cam01/plates_processed/sharpened/cam01_TRK-0001_frame000024_pts1520_plate10.jpg",
    "denoised": "data/snapshots/cam01/plates_processed/denoised/cam01_TRK-0001_frame000024_pts1520_plate10.jpg"
  },
  "rejection_reason": null
}
```

*Note: `registration_number` is intentionally absent in Step 5 output, which serves as input to Step 6 (ANPR/OCR).*

---

## 6. Automated Unit Tests

```powershell
python -m pytest -v
```

All 74 unit tests across catalogue parsing, validation, stream health, vehicle tracking, and plate region localization pass cleanly without requiring a live camera stream or GPU.
