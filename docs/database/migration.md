# Database Migration & Operational Guide — Step 12

## 1. Migration Strategy

The migration workflow moves structured intelligence from legacy file storage (`data/`) into PostgreSQL + PostGIS:

```
 [Legacy Files]
   ├── data/catalogue/normalized/cameras.json
   ├── data/observed/vehicles/vehicles.json
   ├── data/observed/vehicles/observations.jsonl
   ├── data/observed/vehicles/tracks.json
   ├── data/watchlist/vehicles/watchlist.json
   ├── data/matches/raw/matches.jsonl
   └── data/journeys/vehicles/*.json
                  │
                  ▼
   [ scripts/migrate_json_to_postgres.py ]
                  │ (Idempotent Upsert & Deduplication)
                  ▼
     [ PostgreSQL + PostGIS Spatial DB ]
```

---

## 2. Quickstart Execution Commands

### 2.1 Database Initialization
Initialize PostGIS extension and create tables:
```bash
python scripts/init_database.py
```
*(To recreate from scratch, append `--drop-existing`)*

### 2.2 Run Data Migration
Execute the idempotent ETL pipeline:
```bash
python scripts/migrate_json_to_postgres.py
```

### 2.3 Verify Database Health & Counts
Audit table counts and PostGIS status:
```bash
python scripts/verify_database.py
```

---

## 3. Idempotency Guarantees

The migrator is strictly idempotent:
- Running `python scripts/migrate_json_to_postgres.py` multiple times will not insert duplicate records.
- Existing records are detected via primary/unique keys (`camera_id`, `normalized_registration_number`, `observation_id`, `watchlist_id`, `match_id`, `journey_id`).
- Second and subsequent runs will show `0` new observations inserted and log `duplicates_skipped`.

---

## 4. Environment Configuration

Set the following environment variables in `.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=cctv_platform
DATABASE_USER=cctv_user
DATABASE_PASSWORD=your_secure_password
```

Or provide a unified connection URL:
```env
DATABASE_URL=postgresql+psycopg2://cctv_user:your_secure_password@localhost:5432/cctv_platform
```

---

## 5. Troubleshooting & FAQ

### Issue: `fe_sendauth: no password supplied`
- **Cause**: PostgreSQL server requires password authentication, but `DATABASE_PASSWORD` is empty.
- **Fix**: Set `DATABASE_PASSWORD` in your `.env` file or export it in your shell.

### Issue: `could not access file "$libdir/postgis-3": No such file or directory`
- **Cause**: PostgreSQL server does not have the PostGIS spatial extension binary installed.
- **Fix**: Install PostGIS via PostgreSQL Application Stack Builder or download the PostGIS bundle from OSGeo for your PostgreSQL version.

### Issue: Using Local SQLite for Development/Testing
- If PostgreSQL is not running locally, pass `--db-url sqlite:///data/cctv_intelligence.db` to the initialization and migration scripts to run in embedded SQLite mode with automatic Python spherical calculations.
