# Database Schema Documentation — Step 12

This document defines the relational and spatial schema implemented in PostgreSQL and PostGIS.

## Entity Relationship Overview

```
 [cameras] 1 ──── ∞ [vehicle_observations] ∞ ──── 1 [observed_vehicles]
                          │                                   │
                          ├──── ∞ [anpr_observations]         ├──── 1 [vehicle_journeys]
                          │                                   │             │
                          ├──── 1 [vehicle_tracks]            │             ├── ∞ [journey_observations]
                          │                                   │             └── ∞ [journey_legs]
                          └──── ∞ [watchlist_matches] ────────┴──── ∞ [alerts]
                                       │
                              ∞ ───────┴─────── 1 [watchlist_entries]
```

---

## Table Specifications

### 1. `cameras`
Stores camera infrastructure, streaming links, and PostGIS location geometry.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Internal surrogate ID |
| `camera_id` | VARCHAR(64) | UNIQUE, NOT NULL, INDEX | Natural camera identifier (e.g., `cam01`) |
| `camera_number` | INT | NULL | Integer display index |
| `name` | VARCHAR(255) | NULL | Camera descriptive name |
| `location` | TEXT | NULL | Physical location description |
| `status` | VARCHAR(32) | NULL | Health status (`active`, `degraded`, `offline`) |
| `codec` | VARCHAR(32) | NULL | Video codec (`H264`, `HEVC`) |
| `width`, `height` | INT | NULL | Stream dimensions |
| `fps` | FLOAT | NULL | Native framerate |
| `bitrate` | INT | NULL | Bitrate in kbps |
| `rtsp_url` | TEXT | NULL | Source RTSP endpoint |
| `hls_url` | TEXT | NULL | Web HLS streaming endpoint |
| `webrtc_url` | TEXT | NULL | Low-latency WebRTC/WHEP endpoint |
| `timezone` | VARCHAR(64) | NULL | Camera local timezone if verified |
| `latitude` | FLOAT | NULL | Verified WGS84 latitude |
| `longitude` | FLOAT | NULL | Verified WGS84 longitude |
| `geom` | geometry(Point, 4326) | NULL, GIST INDEX | PostGIS spatial point |
| `metadata` | JSONB | NULL | Flexible stream metadata and capabilities |
| `created_at` | TIMESTAMPTZ | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL | Last update timestamp |
| `last_seen_at` | TIMESTAMPTZ | NULL | Last stream heartbeat |

---

### 2. `observed_vehicles`
Aggregated unique vehicles recognized across the surveillance network.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Surrogate ID |
| `vehicle_id` | VARCHAR(64) | NOT NULL, INDEX | Canonical vehicle entity ID |
| `registration_number` | VARCHAR(32) | NOT NULL | Raw observed registration text |
| `normalized_registration_number` | VARCHAR(32) | UNIQUE, NOT NULL, INDEX | Normalized license plate |
| `first_seen_at` | TIMESTAMPTZ | NULL | Source-time calendar first seen anchor |
| `last_seen_at` | TIMESTAMPTZ | NULL | Source-time calendar last seen anchor |
| `observation_count` | INT | NOT NULL, DEFAULT 1 | Total times observed |
| `camera_count` | INT | NOT NULL, DEFAULT 1 | Distinct cameras observed on |
| `best_consensus_score` | FLOAT | NULL | Maximum consensus confidence |
| `status` | VARCHAR(32) | NOT NULL | `CONFIRMED` or `PROBABLE` |
| `metadata` | JSONB | NULL | Additional summary properties |
| `created_at`, `updated_at` | TIMESTAMPTZ | NOT NULL | Audit timestamps |

---

### 3. `vehicle_observations`
Track-level consensus observations per camera.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Surrogate ID |
| `observation_id` | VARCHAR(64) | UNIQUE, NOT NULL, INDEX | Observation ID (`OBS-<cam>-<track>-<pts>`) |
| `vehicle_id` | VARCHAR(64) | NOT NULL, INDEX | Foreign key reference to vehicle entity |
| `camera_id` | VARCHAR(64) | NOT NULL, INDEX | Camera foreign reference |
| `track_id` | VARCHAR(64) | NOT NULL, INDEX | Stream track ID |
| `registration_number` | VARCHAR(32) | NOT NULL | Observed plate string |
| `normalized_registration_number` | VARCHAR(32) | NOT NULL, INDEX | Normalized license plate |
| `first_seen_pts_ms` | FLOAT | NOT NULL | Camera-local track start PTS |
| `recognition_pts_ms` | FLOAT | NOT NULL, INDEX | Camera-local recognition PTS |
| `last_seen_pts_ms` | FLOAT | NOT NULL | Camera-local track exit PTS |
| `source_time` | TIMESTAMPTZ | NULL, INDEX | Wall-clock UTC time if resolved |
| `source_time_status` | VARCHAR(32) | NOT NULL | `RESOLVED` or `NOT_RESOLVED` |
| `consensus_score` | FLOAT | NULL | Multi-frame consensus score (0.0–1.0) |
| `ocr_confidence` | FLOAT | NULL | OCR engine confidence score |
| `evidence_image` | TEXT | NULL | Snapshot image file path |
| `evidence_metadata` | JSONB | NULL | Crop coordinates and detection metrics |
| `created_at` | TIMESTAMPTZ | NOT NULL | Ingestion timestamp |

---

### 4. `anpr_observations`
Raw frame-level OCR readings preserving evidence provenance.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Surrogate ID |
| `observation_id` | VARCHAR(64) | NULL, INDEX | Parent observation ID |
| `camera_id` | VARCHAR(64) | NOT NULL, INDEX | Camera ID |
| `track_id` | VARCHAR(64) | NOT NULL, INDEX | Track ID |
| `frame_id` | INT | NULL | Stream frame number |
| `pts_ms` | FLOAT | NULL | Frame PTS |
| `raw_text` | VARCHAR(64) | NULL | Exact un-normalized OCR output |
| `normalized_text` | VARCHAR(32) | NULL, INDEX | Cleaned alphanumeric text |
| `ocr_confidence` | FLOAT | NULL | Model confidence |
| `image_crop_path` | TEXT | NULL | Path to cropped plate JPEG |
| `ocr_engine` | VARCHAR(64) | NOT NULL | OCR engine (`EasyOCR`) |
| `created_at` | TIMESTAMPTZ | NOT NULL | Audit timestamp |

---

### 5. `watchlist_entries`
Hotlist targets and priority alert configurations.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Surrogate ID |
| `watchlist_id` | VARCHAR(64) | UNIQUE, NOT NULL, INDEX | Target ID (e.g., `WL-0001`) |
| `registration_number` | VARCHAR(32) | NOT NULL | Target plate string |
| `normalized_registration_number` | VARCHAR(32) | NOT NULL, INDEX | Normalized target plate |
| `category` | VARCHAR(64) | NOT NULL | Threat category (`STOLEN_VEHICLE`, `WANTED`) |
| `priority` | VARCHAR(32) | NOT NULL | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` |
| `status` | VARCHAR(32) | NOT NULL | `ACTIVE`, `RESOLVED`, `EXPIRED` |
| `source` | VARCHAR(64) | NOT NULL | `SYNTHETIC_DEMO` |
| `synthetic` | BOOLEAN | NOT NULL | True for hackathon demonstration |
| `created_at`, `updated_at` | TIMESTAMPTZ | NOT NULL | Target lifecycle timestamps |

---

### 6. `watchlist_matches`
Verified real-time watchlist hits.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Surrogate ID |
| `match_id` | VARCHAR(64) | UNIQUE, NOT NULL, INDEX | Match hit ID (`MATCH-...`) |
| `observation_id` | VARCHAR(64) | NOT NULL, INDEX | Triggering observation |
| `watchlist_id` | VARCHAR(64) | NOT NULL, INDEX | Matched watchlist target |
| `decision` | VARCHAR(32) | NOT NULL | `MATCH`, `NOT_ELIGIBLE` |
| `match_score` | FLOAT | NOT NULL | Normalized similarity score |
| `camera_id` | VARCHAR(64) | NOT NULL, INDEX | Camera installation |
| `track_id` | VARCHAR(64) | NOT NULL | Vehicle track |
| `recognition_pts_ms` | FLOAT | NOT NULL | Camera PTS |
| `evidence_image` | TEXT | NULL | Plate snapshot path |
| `created_at` | TIMESTAMPTZ | NOT NULL | Match event timestamp |

---

### 7. `vehicle_journeys` & `journey_legs`
Cross-camera reconstructed observation sequences.

`vehicle_journeys`:
- `journey_id` (PK), `vehicle_id`, `registration_number`, `status`, `time_basis`, `source_time_resolution_status`, `confidence`.

`journey_legs`:
- `id` (PK), `journey_id`, `from_observation_id`, `to_observation_id`, `from_camera_id`, `to_camera_id`, `time_delta_seconds`, `straight_line_distance_m`, `distance_status`, `plausibility`, `implied_straight_line_speed`.
