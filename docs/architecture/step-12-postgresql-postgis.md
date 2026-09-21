# Step 12 Architecture — PostgreSQL + PostGIS Spatial Data Layer

## 1. Executive Summary & Purpose

Step 12 migrates the Gujarat Police CCTV Intelligence Platform from temporary JSON/JSONL file storage into an authoritative, enterprise-grade relational and spatial database built on **PostgreSQL**, **PostGIS**, and **SQLAlchemy**.

```
                  [ Kafka Event Stream / AI Pipeline ]
                                   │
                                   ▼
                   [ Repository Abstraction Layer ]
    (CameraRepo, VehicleRepo, ObservationRepo, WatchlistRepo, JourneyRepo)
                                   │
                                   ▼
                       [ SQLAlchemy 2.0 ORM ]
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
   PostgreSQL Relational Storage             PostGIS Spatial Engine
   ├── cameras (metadata JSONB)              ├── camera.geom (POINT 4326)
   ├── observed_vehicles                     ├── ST_DistanceSphere()
   ├── vehicle_observations                  ├── ST_DWithin()
   ├── anpr_observations (raw OCR)           └── ST_MakeEnvelope() (bbox)
   ├── vehicle_tracks
   ├── watchlist_entries (SYNTHETIC_DEMO)
   ├── watchlist_matches
   ├── alerts
   └── vehicle_journeys + journey_legs
```

---

## 2. Core Architectural Principles

1. **Authoritative Relational Core**: PostgreSQL is the single source of truth for recognized vehicle sightings, hotlist targets, and journey timelines.
2. **PostGIS Point Geometries**: Camera coordinates are stored as `geometry(Point, 4326)` ($X = \text{longitude}$, $Y = \text{latitude}$). PostGIS spatial indexes (GIST) enable real-time bounding-box and radial distance queries.
3. **No Raw Video in Database**: PostgreSQL stores filesystem references and image paths to evidence snapshots (`evidence_image_path`), never binary video blobs.
4. **Common-Clock Time Separation**:
   - `recognition_pts_ms`: Stream-local media timing. Never indexed or compared across distinct cameras as global time.
   - `source_time` + `source_time_status`: Wall-clock UTC time (from camera NTP/RTSP). Used for global queries only when `source_time_status == "RESOLVED"`.
5. **Zero Coordinate Fabrication**: If latitude or longitude are missing from the Sentinel camera catalogue, `geom` is strictly stored as `NULL`. No invented GPS coordinates are permitted.
6. **Repository Decoupling**: Business logic and API endpoints interact solely with repository abstractions (`CameraRepository`, `JourneyRepository`, etc.), keeping raw SQL and ORM sessions cleanly decoupled.
7. **Transparent Fallback**: The connection layer dynamically accommodates PostgreSQL+PostGIS in production and embedded SQLite with Python spherical calculations for local offline tests.

---

## 3. PostGIS Spatial Operations

### Spatial Distance
Straight-line distance between two cameras is computed using PostGIS spherical geometry:
```sql
SELECT ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint(cam_a.longitude, cam_a.latitude), 4326),
    ST_SetSRID(ST_MakePoint(cam_b.longitude, cam_b.latitude), 4326)
);
```

### Radial Proximity Search (`nearby_cameras`)
Locates active cameras within a specified meter radius around an incident coordinate:
```sql
SELECT camera_id, name, latitude, longitude,
       ST_DistanceSphere(geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) AS distance_m
FROM cameras
WHERE geom IS NOT NULL
  AND ST_DistanceSphere(geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) <= :radius_m
ORDER BY distance_m ASC;
```

### Bounding-Box Containment (`cameras_in_bbox`)
Filters cameras inside an operational geofence:
```sql
SELECT * FROM cameras
WHERE geom && ST_MakeEnvelope(:min_lon, :min_lat, :max_lon, :max_lat, 4326);
```

---

## 4. Statewide Scaling Toward 80,000+ Cameras

For future statewide deployment across Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, and highway networks):
- **Partitioning**: Partition `vehicle_observations` and `anpr_observations` by calendar month using PostgreSQL declarative partitioning.
- **Connection Pooling**: Deploy PgBouncer in front of PostgreSQL for high-throughput edge worker concurrency.
- **Read Replicas**: Distribute GIS query traffic (command centre video walls and spatial maps) to read-only PostGIS replicas.
- **Cold Storage Archival**: Periodically archive observations older than 90 days into object storage (e.g. S3/GCS Parquet), retaining metadata summaries in `observed_vehicles`.
