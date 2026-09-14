# Step 7 Architecture -- Observed Vehicle Database

## 1. Overview & Purpose

Step 7 implements the **Observed Vehicle Database** for the Gujarat Police Innovation Hackathon 2026 CCTV platform.

> **Fundamental Principle**: The Observed Vehicle Database represents factual ground truth extracted from CCTV cameras ("What did the cameras actually observe?"). It does **NOT** decide whether a vehicle is wanted, suspicious, or actionable.

---

## 2. Strict Data Separation: Observed Vehicles vs Watchlists

```
+-------------------------------------------------------------+
|               CCTV Video Ingestion (Steps 1-3)               |
|            Vehicle Detection & Tracking (Step 4)             |
|        Best-Frame & License Plate Detection (Step 5)         |
|         ANPR / OCR & Multi-Frame Consensus (Step 6)          |
+-------------------------------------------------------------+
                              |
                              v
       +-----------------------------------------------+
       |   OBSERVED VEHICLE DATABASE (Step 7 - HERE)   |
       |  - What vehicles were observed?               |
       |  - Where (cameras) and when (PTS/media clock)?|
       |  - How reliable was the recognition?          |
       |  - Full evidence provenance back to frames    |
       |  * NO WANTED / SUSPICIOUS / ALERT FIELDS *    |
       +-----------------------------------------------+
                              |
       +----------------------+-----------------------+
       |                                              |
       v (Step 8)                                     v (Step 9)
+-------------------------------+             +-----------------------+
|      WATCHLIST DATABASE       |             |  WATCHLIST MATCHING   |
|  - Stolen vehicles            | ----------> |      & ALERTS         |
|  - Wanted suspects            |             |  - Cross-references   |
|  - Amber alert lookouts       |             |    Observed vs List   |
+-------------------------------+             +-----------------------+
```

---

## 3. Storage Layout & Files

Storage resides under `data/observed/vehicles/`:

- **`observations.jsonl`**: Append-only log of individual vehicle observation events.
- **`vehicles.json`**: Aggregated unique vehicle profiles indexed by normalized registration number.
- **`tracks.json`**: Preserved vehicle track records and supporting frame evidence.
- **`uncertain_observations.jsonl`**: Audit log of low-confidence (`UNCERTAIN`, `UNREADABLE`) recognition records.

---

## 4. Rigorous Timestamp Semantics

To ensure forensic integrity and prevent hallucinated clock times, Step 7 strictly separates three timing domains:

1. **Media Presentation Timestamps (PTS)**:
   - `first_seen_pts_ms`: Stream PTS when the vehicle track first appeared in the camera feed.
   - `recognition_pts_ms`: Stream PTS of the strongest supporting evidence frame that determined the final ANPR reading.
   - `last_seen_pts_ms`: Stream PTS when the vehicle track departed or ended.
   - *Unit*: Milliseconds since stream start / container origin.

2. **Source Calendar Time**:
   - `source_time`: The real-world UTC/IST calendar time of the CCTV event.
   - `source_time_status`: `NOT_RESOLVED` or `RESOLVED`.
   - **Rule**: `source_time` remains `null` unless a validated wall-clock mapping exists (e.g. NTP/SEI stream metadata). Step 7 **NEVER** fabricates source time by adding PTS to `datetime.now()`.

3. **Application Ingestion Time**:
   - `ingested_at_utc`: The wall-clock timestamp at which the platform ingested or recorded the observation (`datetime.now(timezone.utc).isoformat()`). Clearly demarcated as application processing time.

---

## 5. The Common-Clock Rule & Cross-Camera View

> [!WARNING]
> **PTS cannot be directly compared across cameras!**
> Camera `cam01` at PTS $10.240\text{ s}$ and `cam07` at PTS $45.200\text{ s}$ do NOT mean `cam07` was observed 35 seconds later.
> Each camera stream maintains its own independent container media timeline.
>
> Cross-camera chronological ordering requires a validated common source-time mapping (`source_time_status == "RESOLVED"`). Until then, sightings are presented strictly as a **"Media Timeline / Observation Sequence"**, not a verified chronological route.

### 12-Hour Loop Handling
Sentinel CCTV feeds operate within a 12-hour looping slot. Step 7 supports storing `loop_instance` (integer iteration) to prevent PTS collisions across repeated loop cycles when exposed by stream decoders.

---

## 6. Schemas

### Observation Schema (`observations.jsonl`)
```json
{
  "observation_id": "OBS-cam01-TRK-0001-11200",
  "camera_id": "cam01",
  "track_id": "TRK-0001",
  "registration_number": "GJ01AB1234",
  "normalized_registration_number": "GJ01AB1234",
  "first_seen_pts_ms": 10240.0,
  "recognition_pts_ms": 11200.0,
  "last_seen_pts_ms": 12480.0,
  "source_time": null,
  "source_time_status": "NOT_RESOLVED",
  "ocr_confidence": 0.93,
  "plate_detection_confidence": 0.95,
  "plate_quality_score": 0.88,
  "consensus_score": 0.94,
  "supporting_frame_count": 3,
  "status": "CONFIRMED",
  "evidence_image": "data/snapshots/cam01/plates/cam01_TRK-0001_frame000024_pts1520_plate08.jpg",
  "evidence_filename_pts_status": "DISCREPANCY",
  "evidence_filename_pts_ms": 1520.0,
  "source": "sentinel",
  "loop_instance": null,
  "ingested_at_utc": "2026-08-31T20:54:00.956449+00:00",
  "observed_at_pts_ms": 10240.0
}
```

### Aggregated Vehicle Schema (`vehicles.json`)
```json
{
  "vehicle_id": "VEH-000001",
  "registration_number": "GJ01AB1234",
  "normalized_registration_number": "GJ01AB1234",
  "first_seen": {
    "camera_id": "cam01",
    "pts_ms": 10240.0,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED"
  },
  "last_seen": {
    "camera_id": "cam07",
    "pts_ms": 47800.0,
    "source_time": null,
    "source_time_status": "NOT_RESOLVED"
  },
  "camera_count": 2,
  "cameras": ["cam01", "cam07"],
  "observation_count": 2,
  "track_count": 2,
  "best_consensus_score": 0.94,
  "average_consensus_score": 0.93,
  "status": "OBSERVED",
  "timeline": [
    {
      "camera_id": "cam01",
      "track_id": "TRK-0001",
      "first_seen_pts_ms": 10240.0,
      "recognition_pts_ms": 11200.0,
      "last_seen_pts_ms": 12480.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED",
      "status": "CONFIRMED",
      "consensus_score": 0.94,
      "evidence_image": "data/snapshots/cam01/plates/cam01_TRK-0001_frame000024_pts1520_plate08.jpg",
      "evidence_filename_pts_status": "DISCREPANCY",
      "ingested_at_utc": "2026-08-31T20:54:00.956449+00:00"
    },
    {
      "camera_id": "cam07",
      "track_id": "TRK-0019",
      "first_seen_pts_ms": 45200.0,
      "recognition_pts_ms": 46000.0,
      "last_seen_pts_ms": 47800.0,
      "source_time": null,
      "source_time_status": "NOT_RESOLVED",
      "status": "CONFIRMED",
      "consensus_score": 0.92,
      "evidence_image": "data/snapshots/cam07/plates/sample_cam07.jpg",
      "evidence_filename_pts_status": "UNKNOWN",
      "ingested_at_utc": "2026-08-31T20:54:01.065156+00:00"
    }
  ]
}
```

---

## 7. Evidence Provenance & Filename PTS Audit

Every observation links backward through the complete evidence chain:
$$\text{vehicle} \to \text{observation} \to \text{track} \to \text{consensus} \to \text{evidence frame} \to \text{camera} \to \text{PTS} \to \text{image crop}$$

### Filename PTS Discrepancy Auditing
When an evidence image path contains an embedded timestamp (e.g. `frame000024_pts1520_plate08.jpg`), Step 7 extracts `filename_pts` and compares it against the container `evidence_pts_ms`:
- **`MATCH`**: $\left|\text{filename\_pts} - \text{evidence\_pts}\right| < 1.0\text{ ms}$.
- **`DISCREPANCY`**: Filename PTS and evidence PTS differ (both values preserved in audit metadata).
- **`UNKNOWN`**: Filename does not embed a PTS pattern.

---

## 8. Future PostgreSQL Migration Mapping

| Current File Storage | Future PostgreSQL Table | Key Fields & Indices |
|---|---|---|
| `observations.jsonl` | `vehicle_observations` | `observation_id` (PK), `camera_id`, `track_id`, `normalized_registration`, `first_seen_pts_ms`, `recognition_pts_ms`, `last_seen_pts_ms`, `source_time`, `source_time_status`, `ingested_at_utc`, `evidence_image` |
| `vehicles.json` | `observed_vehicles` | `vehicle_id` (PK), `normalized_registration` (UNIQUE INDEX), `camera_count`, `observation_count`, `best_consensus_score` |
| `tracks.json` | `vehicle_tracks` | `track_id` (PK), `camera_id`, `normalized_registration`, `first_seen_pts_ms`, `recognition_pts_ms`, `last_seen_pts_ms`, `source_time`, `source_time_status` |
| `uncertain_observations.jsonl` | `uncertain_observations` | `observation_id` (PK), `camera_id`, `track_id`, `raw_text`, `status`, `reason`, `first_seen_pts_ms` |
