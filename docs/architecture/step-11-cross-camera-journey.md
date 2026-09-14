# Step 11 Architecture -- Cross-Camera Vehicle Correlation & Journey Reconstruction

## 1. Executive Summary & Purpose

Step 11 answers the core investigative question for the Gujarat Police Innovation Hackathon 2026 platform:

> **"Where and when was a particular recognized vehicle observed across the integrated CCTV network?"**

By aggregating ANPR observations across different cameras, the platform correlates sightings into a unified vehicle observation history and reconstructs physical travel trajectories when valid temporal and spatial information exists.

```
Step 7 Observed Database (observations.jsonl)
                  ↓
       [ ObservationLoader ]  ← Camera Catalogue (cameras.json)
                  ↓
     [ ObservationCorrelator ] (Intra-track aggregation)
                  ↓
       [ SequenceBuilder ]     (Enforces Common-Clock Rule)
         ├── Mode A: SOURCE_TIME (Chronological order)
         └── Mode B: CAMERA_LOCAL (Camera-local PTS sequence)
                  ↓
    [ PlausibilityAnalyzer ]   (Haversine distance & implied speed)
                  ↓
       [ JourneyScorer ]       (Transparent engineering confidence score)
                  ↓
       [ VehicleJourney ]
         ├── Machine Report (data/journeys/reports/<reg>_journey.json)
         └── Human Report   (data/journeys/reports/<reg>_journey.txt)
```

---

## 2. The Common-Clock Rule & Time Model

### Strict Separation of Clocks
The system strictly distinguishes three distinct timelines:
1. **Camera-Local Media PTS** (`first_seen_pts_ms`, `recognition_pts_ms`, `last_seen_pts_ms`):
   - Relative to the camera's individual video stream or file offset.
   - **Never compared across distinct cameras as a global clock.**
   - Example: `cam01` PTS 10.240s and `cam07` PTS 45.200s does **not** mean `cam07` occurred 34.960s after `cam01`.
2. **Source Calendar Time** (`source_time`, `source_time_status`):
   - Wall-clock time provided by camera NTP/RTSP headers or camera metadata.
   - Only used for cross-camera chronological ordering when `source_time_status == "RESOLVED"`.
3. **Application Ingestion Time** (`ingested_at_utc`):
   - Audit timestamp recording when the platform processed the record. Never used as real-world observation time.

### Ordering Modes
- **MODE A — SOURCE_TIME ORDERING**:
  - Activated when all observations possess `source_time_status == "RESOLVED"`.
  - Segments are ordered chronologically.
  - Time deltas and transit speeds are computed between consecutive cameras.
- **MODE B — CAMERA-LOCAL OBSERVATION SEQUENCE**:
  - Activated when `source_time_status == "NOT_RESOLVED"`.
  - Observations are grouped by camera and sorted strictly within each camera by local PTS.
  - Labeled: `"OBSERVATION_SEQUENCE_ONLY"` with prominent disclaimers.
  - Cross-camera time deltas are left as `null` / `UNRESOLVED`.

---

## 3. Data Hierarchy & Aggregation

### Intra-Camera Aggregation (`CameraObservationSegment`)
- Multiple detections of the same vehicle in consecutive frames of the same camera track (`cam01 / TRK-0001`) are aggregated into a single `CameraObservationSegment`.
- Spans the earliest `first_seen_pts_ms` to the latest `last_seen_pts_ms`, with the best `recognition_pts_ms` and highest `consensus_score`.

### Cross-Camera Separation
- Sightings on `cam01` and `cam07` are **never collapsed** into a single track, even if the registration number matches.
- Repeated visits to the same camera across different tracks (`cam01` TRK-0001, then later `cam01` TRK-0050) remain distinct segments.
- Looping routes (e.g. `cam01 -> cam07 -> cam01`) retain all 3 segments.

---

## 4. Spatial Distance & Plausibility Analysis

### Approximate Straight-Line Distance
- Computed using the **Haversine formula** between camera geographic coordinates (`latitude`, `longitude`).
- Strictly labeled as **"approximate straight-line distance"**. No road routes are inferred without external GIS road networks.
- If camera coordinates are null in `cameras.json`, distance is recorded as `null` (coordinates are never fabricated).

### Implied Straight-Line Speed
- Calculated only when both coordinates and resolved source timestamps exist:
  $$\text{Speed (km/h)} = \frac{\text{Distance (km)}}{\text{Time Delta (hours)}}$$
- Labeled as **"implied straight-line speed"** (anomaly detection signal, not vehicle speedometer reading).

### Plausibility States
- `PLAUSIBLE`: Implied speed $\le 120\text{ km/h}$ and positive time delta.
- `POSSIBLE`: $120 < \text{Implied speed} \le 180\text{ km/h}$.
- `ANOMALOUS`: Implied speed $> 180\text{ km/h}$ or non-positive time delta ($\le 0$).
- `UNKNOWN`: Assigned when either source time or camera coordinates are unavailable.

---

## 5. Engineering Confidence Scoring (`JourneyConfidenceScore`)

Provides a transparent, auditable quality metric ($0.0 - 1.0$) composed of:
1. **Recognition Quality ($35\%$)**: Mean consensus score and OCR confidence.
2. **Temporal Resolution ($30\%$)**: Full resolution ($1.0$), partial ($0.5$), or PTS-only ($0.2$).
3. **Spatial Resolution ($15\%$)**: Percentage of cameras with valid GIS coordinates.
4. **Plausibility Consistency ($20\%$)**: Penalized by the fraction of anomalous legs.

Component scores and diagnostic notes are always presented alongside the composite score.

---

## 6. Gating: Definitive vs Candidate Sightings

- **Default Mode (`include_probable = False`)**: Only observations with `recognition_status == "CONFIRMED"` form definitive journeys.
- **Investigative Mode (`include_probable = True`)**: `PROBABLE` observations are included as labeled candidate sightings, preventing false positive journey contamination.

---

## 7. Migration Path to PostgreSQL / PostGIS

While the current PoC uses JSON/JSONL (`data/journeys/`), the interface `JourneyRepository` is designed for drop-in migration to PostgreSQL with PostGIS:

```sql
-- Future PostgreSQL/PostGIS Schema

CREATE TABLE vehicle_observations (
    observation_id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) NOT NULL,
    registration_number VARCHAR(16) NOT NULL,
    normalized_registration_number VARCHAR(16) NOT NULL,
    camera_id VARCHAR(32) NOT NULL,
    track_id VARCHAR(32) NOT NULL,
    first_seen_pts_ms DOUBLE PRECISION,
    recognition_pts_ms DOUBLE PRECISION,
    last_seen_pts_ms DOUBLE PRECISION,
    source_time TIMESTAMPTZ,
    source_time_status VARCHAR(16) NOT NULL DEFAULT 'NOT_RESOLVED',
    loop_instance INT,
    recognition_status VARCHAR(16) NOT NULL,
    consensus_score REAL NOT NULL,
    ocr_confidence REAL NOT NULL,
    camera_location GEOMETRY(Point, 4326),
    evidence_image TEXT,
    evidence_filename_pts_status VARCHAR(16),
    ingested_at_utc TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicle_journeys (
    journey_id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) NOT NULL,
    registration_number VARCHAR(16) NOT NULL,
    normalized_registration_number VARCHAR(16) NOT NULL,
    ordering_mode VARCHAR(16) NOT NULL,
    status VARCHAR(32) NOT NULL,
    confidence_score REAL,
    total_distance_m DOUBLE PRECISION,
    total_duration_seconds DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journey_legs (
    leg_id VARCHAR(64) PRIMARY KEY,
    journey_id VARCHAR(64) REFERENCES vehicle_journeys(journey_id) ON DELETE CASCADE,
    from_observation_id VARCHAR(64) NOT NULL,
    to_observation_id VARCHAR(64) NOT NULL,
    from_camera_id VARCHAR(32) NOT NULL,
    to_camera_id VARCHAR(32) NOT NULL,
    time_delta_seconds DOUBLE PRECISION,
    straight_line_distance_m DOUBLE PRECISION,
    implied_speed_kmh DOUBLE PRECISION,
    source_time_status VARCHAR(16) NOT NULL,
    plausibility VARCHAR(16) NOT NULL,
    plausibility_reason TEXT,
    trajectory_line GEOMETRY(LineString, 4326)
);
```

---

## 8. Non-Claims & Operational Limitations

1. **No Road Path Claim**: The platform computes approximate straight-line distances between camera locations. It does not claim the vehicle followed that exact Euclidean vector.
2. **No Speeding Enforcement**: Implied straight-line speed is an anomaly detection heuristic, not an evidentiary speed measurement.
3. **No Cross-Camera PTS Clock**: In the absence of NTP-synchronized camera calendar timestamps, sightings are presented as camera-local observation sequences without fabricated travel times.
