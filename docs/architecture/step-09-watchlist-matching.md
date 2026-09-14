# Step 9 Architecture -- Real-Time Watchlist Matching

## 1. Core Principles: Observation vs Watchlist Entry vs Match

To prevent data corruption, forensic ambiguity, or circular logic, the platform strictly enforces boundaries between three fundamental entities:

```
+-------------------------------------------------------------+
|                ANPR Stream Processing (Steps 1-7)           |
+-------------------------------------------------------------+
                              |
                              v
        +-----------------------------------------------+
        |                 OBSERVATION                   |
        |  "CCTV cameras observed this vehicle plate."  |
        |  - Factual ground truth                       |
        |  - Media PTS & camera-local timelines         |
        |  - Immutable (NEVER altered by a match)       |
        +-----------------------------------------------+
                              |
                              +------------------------+
                              |                        |
                              v                        v
        +-------------------------------+  +-----------------------+
        |        WATCHLIST ENTRY        |  |  MATCH DECISION       |
        |  "Target vehicle configured   |  |  (Step 9 - HERE)      |
        |   for monitoring."            |  |  "Qualifying sighting |
        |  - Synthetic demo targets     |  |   matched an ACTIVE   |
        |  - Priority & categories      |  |   watchlist target."  |
        |  - ACTIVE / INACTIVE states   |  |  - Auditable decision |
        +-------------------------------+  |  - Evidence preserved |
                                           |  - Deduplicated       |
                                           +-----------------------+
                                                       |
                                                       v
                                           +-----------------------+
                                           |  ALERT-READY EVENT    |
                                           |  (For Step 10 Kafka)  |
                                           +-----------------------+
```

1. **Observation**: What CCTV actually saw (`data/observed/vehicles/observations.jsonl`). Never modified simply because a match occurs.
2. **Watchlist Entry**: What authorities have registered for monitoring (`data/watchlist/vehicles/watchlist.json`).
3. **Match**: An auditable event confirming that an eligible observation corresponded to an `ACTIVE` watchlist record.

---

## 2. Matching Eligibility Gate

Raw ANPR readings are prone to optical noise, low resolution, or partial occlusions. Automated watchlist lookup must not trigger on uncertain data.

### Eligibility Rules (`src/watchlist/eligibility.py`)
- **Recognition Status**: Must be `CONFIRMED` (by multi-frame consensus). `UNCERTAIN` or `UNREADABLE` recognitions are gated out.
- **Consensus Score**: Must satisfy `consensus_score >= min_consensus_score` (default: `0.80`).
- **OCR Confidence**: Must satisfy `ocr_confidence >= min_ocr_confidence` (default: `0.70`).
- **Format Validity**: Registration number must conform to standard Indian registration patterns (`validate_watchlist_registration`).

### Rejection Reasons
Ineligible observations produce a `NOT_ELIGIBLE` decision with an explicit reason:
- `UNCERTAIN_RECOGNITION`
- `LOW_CONSENSUS`
- `LOW_OCR_CONFIDENCE`
- `INVALID_REGISTRATION`
- `MISSING_REGISTRATION`
- `LOW_IMAGE_QUALITY`

---

## 3. Exact Matching & Score Separation

### Exact Normalized Equality
The primary matching mechanism compares canonical normalized strings:
$$\text{normalize}(\text{observed\_reg}) == \text{normalize}(\text{watchlist\_reg})$$

### Active-Only Rule
Only records with `status == "ACTIVE"` trigger positive matches.
- Inactive or expired watchlist records yield `NO_MATCH` with reason `INACTIVE_WATCHLIST_ENTRY`.

### Score Separation Rule
Text equality does not prove the underlying OCR is correct:
- `watchlist_match_score`: String matching confidence (1.0 for exact equality).
- `recognition_confidence`: Raw neural OCR confidence (e.g. 0.93).
- `consensus_score`: Multi-frame consensus score (e.g. 0.94).

Step 9 records all three scores independently in the `MatchDecision` schema.

---

## 4. Controlled Fuzzy Candidate Review (Optional)

To address optical OCR character confusion (e.g. `8` vs `B`, `0` vs `D`, `1` vs `I`), Step 9 provides a controlled fuzzy review classifier:
- **Default for Automated Alerts**: **DISABLED**. Single-character discrepancies do not generate automated high-priority alerts.
- **When Enabled**: Compares against active watchlist targets with Levenshtein edit distance $\le 1$.
- **Decision Output**: Produces `POSSIBLE_MATCH_REVIEW` with:
  - `target_registration`
  - `edit_distance`
  - `similarity_score`
  - Human review routing tag

---

## 5. Alert Deduplication & Suppression Windows

When a vehicle travels through a camera's field of view across multiple frames:
- Step 4 / Step 6 / Step 7 track the vehicle as a unified track (e.g. `TRK-0001`).
- If multiple ANPR observations occur for the same vehicle track, generating multiple identical emergency alerts would overwhelm police dispatchers.

### Track-Level Deduplication (`src/watchlist/deduplication.py`)
- **Suppression Key**: `(camera_id, track_id, watchlist_id)`.
- **Suppression Window**: Configurable duration based on stream PTS (default: 30.0 seconds) or wall-clock fallback.
- **Outcome**:
  - The first observation triggers an **alert-ready match** (`is_deduplicated = False`).
  - Subsequent observations within the window are recorded as suppressed duplicates (`is_deduplicated = True`), incrementing `supporting_observations_count`.

---

## 6. Cross-Camera Independence

> [!IMPORTANT]
> **Cross-Camera Isolation Rule**:
> Observations from different cameras (e.g. `cam01` at PTS $11.2\text{ s}$ and `cam07` at PTS $46.0\text{ s}$) have distinct `camera_id` values in their suppression key.
>
> They are **NEVER** merged or suppressed into a single match event at Step 9.
> Each camera sighting produces its own independent match event. Cross-camera vehicle correlation and journey route reconstruction take place in subsequent downstream layers.

---

## 7. Match Evidence & Metadata Snapshot

Every `MatchDecision` preserves a complete forensic evidence chain:
- `camera_id`, `track_id`, `observation_id`, `match_id`
- Media timing: `first_seen_pts_ms`, `recognition_pts_ms`, `last_seen_pts_ms`
- Source timing: `source_time`, `source_time_status`
- Evidence crop: `evidence_image`, `evidence_filename_pts_status`
- **Watchlist Snapshot**: `category`, `priority`, `status`, `source`, `description` captured at decision time so that future modifications to the watchlist do not corrupt historical audit trails.

---

## 8. Output Storage Layout

Storage resides under `data/matches/`:
- **`raw/matches.jsonl`**: Append-only log of every processed observation decision (auditable trail).
- **`confirmed/matches.jsonl`**: Alert-ready, non-suppressed `MATCH` events.
- **`rejected/rejected.jsonl`**: `NOT_ELIGIBLE` and `NO_MATCH` observations.
- **`deduplicated/dedup_summary.json`**: Aggregate statistics and alert-ready match list.

---

## 9. Future Kafka Streaming Integration (Step 10 Readiness)

Step 9 is fully decoupled from transport protocols. In Step 10, connecting to Apache Kafka will be a drop-in integration:

```
[ ANPR Ingestion (Step 6/7) ]
            |
            v
[ MatchDecisionEngine (Step 9) ]
            |
    +-------+-------+
    |               |
    v (MATCH)       v (ALL DECISIONS)
[ Kafka Producer ] [ Audit Storage ]
    |
    v
Kafka Topics:
  1. `cctv.alerts.high-priority`  (priority == CRITICAL | HIGH)
  2. `cctv.alerts.standard`       (priority == MEDIUM | LOW)
  3. `cctv.matches.raw`           (All decisions for analytics)
```

No core matching logic in `src/watchlist/` will need to be rewritten when Kafka producers are introduced in Step 10.

---

## 10. Security & Hackathon Safety Statement

- **Operational Security**: Watchlist queries do not log full watchlist dumps. Watchlist records are referenced by ID and normalized plate string.
- **Synthetic Data**: All demonstration categories use the `DEMO_` prefix (`DEMO_STOLEN_VEHICLE`, `DEMO_BLACKLISTED_VEHICLE`). No real government databases (VAHAN, SARTHI, eGujCop) or criminal records are used.
