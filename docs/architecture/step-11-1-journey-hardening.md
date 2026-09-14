# Step 11.1 — Cross-Camera Journey Hardening

**Gujarat Police Innovation Hackathon 2026 — CCTV Integration Platform**

---

## 1. Objective

Step 11.1 hardens the cross-camera journey reconstruction layer (Step 11) by:

1. Introducing a formal `SourceTimeResolver` that documents *why* source/calendar time cannot be resolved
2. Adding a validated coordinate enrichment schema
3. Generating a camera metadata availability report
4. Strengthening temporal validation helpers
5. Adding loop/PTS-reset detection infrastructure
6. Building an observation graph (camera A ↔ B sharing a vehicle)
7. Expanding dataset reporting and statistics
8. Enriching all journey data structures with machine-readable resolution fields
9. Adding 20 regression tests (total: 179 passing)

---

## 2. Sentinel Metadata Findings (Part 2)

The Sentinel raw catalogue (`data/catalogue/raw/cameras_20260831_*.json`) contains **only**:
- `id` (camera identifier)
- `name` (human-readable location name)

The normalized catalogue (`data/catalogue/normalized/cameras.json`) expands these to 30 cameras with:
- `latitude: null` (all 30 cameras)
- `longitude: null` (all 30 cameras)
- `timezone: null` (all 30 cameras)
- `extra: {}` (all 30 cameras — no supplementary fields)

**Fields NOT present in the catalogue:** `wall_time`, `server_epoch`, `offset`, `slot_offset`, `slot_seconds`, `loop`

**Conclusion:** Source/calendar time resolution is **NOT_RESOLVED** for all observations. This is disclosed transparently in every journey output.

> See `data/catalogue/normalized/camera_metadata_report.json` for the machine-readable report.

---

## 3. SourceTimeResolver (Part 1)

**File:** `src/journey/source_time.py`

### Resolution Logic

```
resolve(camera_metadata, pts_ms, loop_instance, existing_source_time, existing_source_time_status)
  |
  +-- existing_source_time_status == "RESOLVED" ?
  |     YES -> PASSTHROUGH_EXISTING (confidence=1.0)
  |
  +-- Inspect camera_metadata for anchor fields:
  |   (wall_time, server_epoch, slot_offset, slot_seconds, offset)
  |
  +-- No anchor fields found?
  |     YES -> NOT_RESOLVED / NO_ANCHOR_IN_CATALOGUE
  |
  +-- Anchor fields found but resolution not implemented?
        YES -> NOT_RESOLVED / ANCHOR_PRESENT_BUT_UNIMPLEMENTED
```

### Strict Prohibitions

The resolver **MUST NOT**:
- Compute `datetime.now() + pts_ms`
- Compute `ingestion_time + pts_ms`
- Fabricate any timestamp

### Current Result (all 30 Sentinel cameras)

```json
{
  "source_time": null,
  "status": "NOT_RESOLVED",
  "method": "NO_ANCHOR_IN_CATALOGUE",
  "confidence": 0.0,
  "explanation": "Camera catalogue does not contain any time anchor field (wall_time, server_epoch, slot_offset, slot_seconds, offset). Source/calendar time cannot be derived without a verified anchor. Computation from datetime.now() or ingestion_time is prohibited."
}
```

---

## 4. Temporal Validation Helpers (Part 3)

**File:** `src/journey/temporal.py`

### New Functions

| Function | Purpose |
|----------|---------|
| `validate_source_time(source_time, source_time_status)` | Returns `{valid: bool, reason: str}` |
| `compare_source_times(obs_a, obs_b)` | Returns `-1 / 0 / 1 / None` (None if either unresolved) |
| `detect_time_conflict(segments)` | Returns list of conflict descriptions |

### Time Status Constants (Part 4)

**Journey-level:**
- `OBSERVATION_SEQUENCE_ONLY` — camera-local PTS only; no calendar time
- `PARTIAL_JOURNEY` — some cameras resolved, others not
- `JOURNEY_RECONSTRUCTED` — all cameras have resolved source time
- `TIME_CONFLICT` — resolved times contradict each other

**Observation-level source_time_status:**
- `NOT_RESOLVED` — no calendar anchor available
- `RESOLVED` — verified calendar timestamp present
- `PARTIAL` — partial resolution (e.g. date but not time)
- `CONFLICT` — conflicting timestamps from different sources

---

## 5. Loop Detection (Part 12)

**File:** `src/journey/loop.py`

### Algorithm

PTS reset detection threshold: `current_pts_ms < previous_pts_ms × 0.10`

- Minimum previous PTS to trigger check: 5,000 ms
- Example: prev=43,199,000 ms → curr=2,000 ms → `2000 < 4,319,900` → **DETECTED**
- Does NOT fabricate loop numbers
- `loop_instance` remains `null` unless set by the ingestion pipeline

### `LoopTransitionResult`

```python
@dataclass
class LoopTransitionResult:
    loop_transition_detected: bool
    previous_pts_ms: Optional[float]
    current_pts_ms: Optional[float]
    explanation: str
```

---

## 6. Observation Graph (Part 17)

**File:** `src/journey/graph.py`

### Architecture

- Nodes: camera IDs
- Edges: unordered camera pairs sharing ≥1 vehicle observation
- `temporal_order_known=True` only when both sides have `source_time_status=RESOLVED`

### Current Graph (from real observations)

```
cam01 <---[GJ01AB1234]---> cam07
  vehicle_count: 1
  temporal_order_known: false
```

Output: `data/journeys/reports/camera_transition_statistics.json`

---

## 7. Model Additions (Parts 5, 9, 24)

### `JourneyLeg` — New Fields

| Field | Type | Purpose |
|-------|------|---------|
| `from_source_time` | `Optional[str]` | Source time of the origin segment |
| `to_source_time` | `Optional[str]` | Source time of the destination segment |
| `distance_status` | `str` | `"AVAILABLE"` or `"UNAVAILABLE"` |
| `distance_label` | `str` | Always `"STRAIGHT_LINE_DISTANCE"` — never "road distance" |
| `implied_speed_label` | `str` | Always `"IMPLIED STRAIGHT-LINE SPEED"` |

### `VehicleJourney` — New Fields (Part 24)

| Field | Type | Current Value |
|-------|------|--------------|
| `time_resolution` | `str` | `"NOT_RESOLVED"` |
| `spatial_resolution` | `str` | `"UNAVAILABLE"` |
| `limitations` | `List[str]` | Non-empty list explaining constraints |
| `media_session_id` | `Optional[str]` | `null` |

### `JourneyConfidenceScore` — New Fields

| Field | Type | Purpose |
|-------|------|---------|
| `explanations` | `List[str]` | Structured per-component explanation |

---

## 8. Scoring Guards (Parts 7, 15, 16)

The `JourneyScorer` enforces two explicit guards:

1. **Ingestion time guard**: `ingested_at_utc` (application-level timestamp) does **NOT** increase `temporal_resolution`. Only `source_time_status == "RESOLVED"` counts.

2. **Camera name guard**: `camera_name` text does **NOT** increase `spatial_resolution`. Only verified `camera_latitude` + `camera_longitude` numeric values count.

---

## 9. Data Files

| File | Purpose |
|------|---------|
| `data/catalogue/normalized/camera_metadata_report.json` | Field availability across all 30 cameras |
| `data/catalogue/enrichment/camera_coordinates.json` | Validated coordinate schema (all null) |
| `data/observed/reports/dataset_statistics.json` | Dataset statistics (vehicles, cameras, coverage) |
| `data/journeys/reports/camera_transition_statistics.json` | Camera adjacency graph from observations |

---

## 10. New Scripts

| Script | Purpose |
|--------|---------|
| `scripts/find_multicamera_vehicles.py` | Finds vehicles seen on ≥2 cameras, ranked by coverage |
| `scripts/report_observation_dataset.py` | Generates `dataset_statistics.json` |
| `scripts/validate_journey.py` | Enhanced — 12 integrity checks (was 6) |

---

## 11. Implementation Report (Part 32)

| # | Measurement | Result |
|---|------------|--------|
| 1 | SourceTimeResolver result for cam01 | NOT_RESOLVED / NO_ANCHOR_IN_CATALOGUE |
| 2 | Source time anchor fields found | 0 of 30 cameras |
| 3 | Cameras with coordinates | 0 of 30 |
| 4 | Cameras with timezone | 0 of 30 |
| 5 | Journey status for GJ01AB1234 | OBSERVATION_SEQUENCE_ONLY |
| 6 | Total confirmed observations | 2 |
| 7 | Total probable observations | 1 |
| 8 | Unique vehicles | 2 |
| 9 | Multi-camera vehicles | 1 (GJ01AB1234) |
| 10 | Loop transitions detected in dataset | 0 |
| 11 | Camera graph edges | 1 (cam01 ↔ cam07 via GJ01AB1234) |
| 12 | Tests passing | 179/179 |
| 13 | distance_status on all legs | UNAVAILABLE |
| 14 | implied_speed_kmh on all legs | null |
| 15 | plausibility on all legs | UNKNOWN |
| 16 | time_resolution in journey | NOT_RESOLVED |
| 17 | spatial_resolution in journey | UNAVAILABLE |
| 18 | limitations list non-empty | True (2 entries) |
| 19 | ingestion time used for temporal score | False (guarded) |
| 20 | camera name used for spatial score | False (guarded) |
| 21 | PTS consistency violations in dataset | 0 |

---

## 12. Dataset Expansion Instructions (Part 13)

**IMPORTANT: DO NOT fabricate vehicle observations.**

To expand the dataset from 3 observations (2 cameras) to 30+ observations (5+ cameras):

```bash
# For each camera you want to ingest:
python scripts/run_anpr.py --camera cam02 --frames 300
python scripts/build_observed_vehicle_db.py

# Then rebuild journeys:
python scripts/build_vehicle_journey.py --all

# Check dataset statistics:
python scripts/report_observation_dataset.py

# Check multi-camera vehicles:
python scripts/find_multicamera_vehicles.py
```

The dataset grows only through real ANPR pipeline runs against live or recorded camera streams.

---

## 13. PostgreSQL / PostGIS Migration Path

When migrating from JSON to PostgreSQL:

```sql
-- Observations table
CREATE TABLE observations (
    observation_id TEXT PRIMARY KEY,
    camera_id TEXT NOT NULL,
    normalized_registration_number TEXT NOT NULL,
    first_seen_pts_ms DOUBLE PRECISION,
    recognition_pts_ms DOUBLE PRECISION,
    last_seen_pts_ms DOUBLE PRECISION,
    source_time TIMESTAMPTZ,          -- null until resolved
    source_time_status TEXT NOT NULL DEFAULT 'NOT_RESOLVED',
    time_resolution TEXT NOT NULL DEFAULT 'NOT_RESOLVED',
    ingested_at_utc TIMESTAMPTZ NOT NULL
);

-- Camera catalogue (with PostGIS when coordinates available)
CREATE TABLE cameras (
    camera_id TEXT PRIMARY KEY,
    name TEXT,
    location GEOMETRY(POINT, 4326),   -- null until coordinates provided
    timezone TEXT                     -- null until configured
);
```
