# Step 8 Architecture -- Representative Synthetic Watchlist

## 1. Overview & Separation of Concerns

Step 8 implements the **Representative Synthetic Watchlist Database** for the Gujarat Police Innovation Hackathon 2026 platform.

To maintain strict data integrity, the platform separates three core domains:

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
       |   OBSERVED VEHICLE DATABASE (Step 7)          |
       |  - What vehicles were observed?               |
       |  - Media PTS & camera-local timelines         |
       |  - Evidence provenance back to frames         |
       |  * NO WANTED / SUSPICIOUS / ALERT FIELDS *    |
       +-----------------------------------------------+
                              |
       +----------------------+-----------------------+
       |                                              |
       v                                              v
+-------------------------------+             +-----------------------+
|  SYNTHETIC WATCHLIST (Step 8) |             |  WATCHLIST MATCHING   |
|  - Demonstration targets      | ----------> |      & ALERTS         |
|  - Matching + non-matching    |             |      (Step 9)         |
|  - Explicit SYNTHETIC_DEMO    |             |  - Cross-references   |
|  - Priority & categories      |             |    Observed vs List   |
+-------------------------------+             +-----------------------+
```

1. **Observed Vehicle Database (Step 7)**: Ground truth from CCTV cameras ("What did the cameras see?").
2. **Watchlist Database (Step 8)**: List of entities authorities are looking for ("What are we searching for?").
3. **Matching & Alert Engine (Step 9)**: Cross-references Step 7 against Step 8 to produce actionable alerts.

---

## 2. Synthetic Data Policy & Safety

> [!IMPORTANT]
> **HACKATHON DEMONSTRATION SAFETY POLICY**:
> - All records are explicitly tagged with `source = "SYNTHETIC_DEMO"` and `synthetic = true`.
> - Categories are explicitly prefixed with `DEMO_` (e.g. `DEMO_STOLEN_VEHICLE`, `DEMO_BLACKLISTED_VEHICLE`, `DEMO_VEHICLE_OF_INTEREST`, `DEMO_MISSING_VEHICLE`) to ensure zero confusion with real police records during hackathon evaluation.
> - **NO** real government database (VAHAN, SARTHI, eGujCop, AFIS, NAFIS) is accessed or scraped.
> - **NO** real personally identifiable information (PII) or real criminal records are used.

---

## 3. Match & Non-Match Records

To validate that Step 9 (Matching Engine) correctly evaluates both positive hits and negative misses, Step 8 constructs a balanced synthetic dataset:

1. **MATCHING Records**:
   - Sampled directly from Step 7 `vehicles.json`.
   - Guaranteed to have matching observations in the CCTV stream.
   - Used to demonstrate real-time detection, hit scoring, and priority alerting in Step 9.
2. **NON-MATCHING Records**:
   - Synthesized using valid Indian state and district series (e.g. `MH07ZZ9935`, `GJ02AB4582`).
   - Guaranteed to NOT exist in the current CCTV observations.
   - Used to verify that the matching engine does not trigger false alerts on unobserved plates.

---

## 4. Watchlist Schema (`data/watchlist/vehicles/watchlist.json`)

```json
{
  "watchlist_id": "WL-VEH-000001",
  "entity_type": "vehicle",
  "registration_number": "GJ05CD5678",
  "normalized_registration_number": "GJ05CD5678",
  "category": "DEMO_STOLEN_VEHICLE",
  "priority": "HIGH",
  "status": "ACTIVE",
  "source": "SYNTHETIC_DEMO",
  "synthetic": true,
  "description": "Synthetic demonstration record (Target: Step 7 Observed Match)",
  "notes": "Configured to match actual observed vehicle in CCTV network",
  "created_at": "2026-08-31T20:58:05.836968+00:00",
  "updated_at": "2026-08-31T20:58:05.836968+00:00"
}
```

---

## 5. Plate Normalization & Uniqueness

Watchlist registration numbers are normalized using the identical algorithm from Steps 6 and 7 (`normalize_watchlist_registration`):
- Converts to uppercase.
- Strips whitespace, hyphens, and non-alphanumeric symbols.
- Strips leading `IND` badge prefixes.
- Enforces strict database uniqueness on `normalized_registration_number`. Duplicate entries (e.g. `GJ01AB1234` and `GJ-01-AB-1234`) are automatically rejected by `WatchlistRepository`.

---

## 6. Categories, Priorities, and Lifecycle Statuses

### Categories
- **`DEMO_STOLEN_VEHICLE`**: Simulated vehicle reported stolen for testing immediate emergency alerts.
- **`DEMO_BLACKLISTED_VEHICLE`**: Simulated vehicle banned from security perimeters.
- **`DEMO_VEHICLE_OF_INTEREST`**: Simulated vehicle linked to an ongoing investigation requiring silent monitoring.
- **`DEMO_MISSING_VEHICLE`**: Simulated missing or abandoned vehicle lookup.

### Priority Levels (Metadata for Step 9 Alerting)
- **`CRITICAL`**: Immediate dispatcher alert triggering audible/visual emergency banners.
- **`HIGH`**: Real-time notification dispatched to patrol monitoring dashboards.
- **`MEDIUM`**: Logged with high priority for supervisor review.
- **`LOW`**: Routine monitoring log.

### Lifecycle Statuses
- **`ACTIVE`**: Eligible for real-time ANPR matching.
- **`INACTIVE`**: Retained in database for audit, but ignored by matching engine.
- **`EXPIRED`**: Expired lookout notice, not matched against live streams.

---

## 7. Future Government Database Integration

In future production deployments for Gujarat Police, Step 8 will be replaced by authorized REST / gRPC connectors interfacing directly with state and national registries:

```
+-------------------------------------------------------------+
|                 Authorized External Registries              |
+-------------------------------------------------------------+
   |                  |                    |                |
   v                  v                    v                v
[ VAHAN ]        [ SARTHI ]           [ eGujCop ]      [ NAFIS ]
Vehicle Registry  Driver Licensing     Police Records   Fingerprint/Face
   |                  |                    |                |
   +------------------+--------------------+----------------+
                              |
                              v
             [ Watchlist Ingestion Gateway / ETL ]
            (Transforms external data into internal
              normalized watchlist repository)
```

- **VAHAN**: National vehicle registry providing registration details, stolen vehicle flags, and blacklisted RC statuses.
- **SARTHI**: National driving license registry for driver verification.
- **eGujCop**: Gujarat Police state crime and criminal tracking network.
- **NAFIS / AFIS**: Automated Fingerprint and Biometric Identification Systems.

*Security Notice*: The current hackathon platform operates in zero-network synthetic mode; external APIs are neither called nor simulated beyond synthetic data generation.

---

## 8. Future PostgreSQL Migration Mapping

The repository layer defines `WatchlistRepository` (ABC), enabling a seamless drop-in transition to PostgreSQL:

| Current File Storage | Future PostgreSQL Table | Key Fields & Indices |
|---|---|---|
| `data/watchlist/vehicles/watchlist.json` | `watchlist_vehicles` | `watchlist_id` (PK), `normalized_registration_number` (UNIQUE INDEX), `category`, `priority`, `status`, `source`, `synthetic`, `created_at` |
| `data/watchlist/persons/watchlist.json` | `watchlist_persons` | `watchlist_id` (PK), `category`, `priority`, `status`, `source`, `synthetic` |
| `data/watchlist/metadata/README.md` | `watchlist_metadata` | `config_key` (PK), `config_value`, `updated_at` |
