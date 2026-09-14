# Architecture & Engineering Specifications: Steps 1–3

## Gujarat Unified CCTV Intelligence & Federation Platform

This document describes the architectural principles, connectivity models, and media timing specifications implemented in the foundation layer (Steps 1–3).

---

## 1. Architectural Foundations

The Sentinel sandbox environment represents an operational police/surveillance CCTV network. The design principles strictly govern stream consumption:

1. **Consume-Only Pattern**: Clients must only consume media feeds. The system never publishes/pushes streams or triggers gateway reconfiguration APIs.
2. **Authoritative Catalogue Discovery**: Stream endpoints and camera identifiers are dynamically discovered from the Sentinel catalogue (`https://cctv.corp8.cloud/cameras.json`) or local normalized caches. No camera IDs or stream URLs are hardcoded in application logic.
3. **Multi-Protocol Distribution Topology**:
   - **RTSP (TCP)**: Primary ingest protocol for AI inference, computer vision, and frame decoding pipelines.
   - **HLS**: Intended for web dashboards, command centers, restricted networks, and remote AI workers.
   - **WebRTC (WHEP)**: Low-latency browser preview.

---

## 2. Media Timing & Synchronization Model

### Presentation Timestamp (PTS) vs. Arrival Clocks
In CCTV analytics, video timing must reflect the capture moment, not transport jitter:

- **Media Container PTS (`media_pts_ms`)**:
  - Derived via `cap.get(cv2.CAP_PROP_POS_MSEC)`.
  - Authoritative timeline for cross-camera correlation, vehicle speed calculation, and temporal indexing in PostgreSQL/PostGIS.
  - Robust against network lag, packet bundling, and decoding delay.

- **Local Monotonic Clock (`local_receive_monotonic`)**:
  - Sampled using `time.monotonic()` upon frame delivery.
  - Used exclusively for jitter calculation, transport health tracking, and timeout detection.
  - **NEVER** substitute local arrival time for video presentation time.

- **Strict Prohibitions**:
  - `CAP_PROP_FPS` must **NEVER** be used as a timing assumption. Real surveillance feeds fluctuate.
  - Timestamps must **NEVER** be calculated via `frame_number / fps` or `datetime.now()`.

---

## 3. Resilience and Discontinuity Handling

### Exponential Backoff Reconnect Schedule
Network interruptions on field CCTV feeds are expected. To prevent thrashing:
$$\text{Interval Schedule} = [2\text{s}, 4\text{s}, 8\text{s}, 16\text{s}, 30\text{s (max)}]$$
- After each failed attempt, backoff advances up to 30 seconds.
- Backoff resets to 2 seconds only after a sustained connection (default: 30 consecutive valid frames).

### Stream Discontinuities & Loops
Sandbox and looped surveillance feeds exhibit temporal boundary conditions:
1. **PTS Backwards Jump ($PTS_t < PTS_{t-1}$)**:
   - Identifies stream loop replay or encoder timestamp reset.
   - Flagged as a timing discontinuity in `StreamHealth`.
2. **Large Forward Gap ($PTS_t - PTS_{t-1} > 5000\text{ms}$)**:
   - Identifies network dropouts or upstream camera restart.
   - Preserves timeline continuity without crashing the pipeline.
3. **Initial Decoder Warnings**:
   - H.264/H.265 streams often produce initial non-fatal parsing warnings before the first IDR/keyframe arrives.
   - The reader allows transient read misses without dropping the session.

---

## 4. Security & Access Control

1. **Authentication Integrity**:
   - Sentinel catalogue requires password authentication (`LMUS-8KLY-RJDE`).
   - The platform never attempts to bypass authentication or scrape unauthorized endpoints.
   - Session cookies and tokens are kept in `.env` and masked in all log outputs.
2. **Explicit Mode Separation**:
   - `CATALOGUE_SOURCE=live`: Authenticates against live Sentinel sandbox.
   - `CATALOGUE_SOURCE=local`: Reads local development export, printing a mandatory warning banner.
