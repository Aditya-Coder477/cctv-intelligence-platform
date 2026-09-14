# Network & Connectivity Troubleshooting Guide

## Gujarat Unified CCTV Intelligence & Federation Platform

This reference provides actionable diagnostic steps and resolutions for network, authentication, and stream decoding issues.

---

## 1. Authentication & Catalogue Diagnostics (Step 1)

### Symptom: HTTP 302 Redirect to `/auth/login`
- **Cause**: Sentinel requires authorized session credentials. Unauthenticated requests are redirected to the HTML login form.
- **Verification Command (Windows CMD / PowerShell)**:
  ```cmd
  curl -i -L https://cctv.corp8.cloud/cameras.json
  ```
- **Diagnostic Output**:
  ```
  HTTP/1.1 302 Found
  Location: /auth/login
  ```
- **Resolution**:
  Set the authorized password in `.env`:
  ```ini
  SENTINEL_AUTH_PASSWORD=LMUS-8KLY-RJDE
  ```
  Or switch to local development mode if working offline:
  ```ini
  CATALOGUE_SOURCE=local
  ```

### Symptom: HTTP 401 Unauthorized / HTTP 403 Forbidden
- **Cause**: Provided password, token, or session cookie expired or invalid.
- **Resolution**: Verify credentials in `.env` without committing or publishing secrets. Do NOT attempt to brute-force or bypass the endpoint.

### Symptom: DNS Resolution Failure or Timeout
- **Cause**: Host `cctv.corp8.cloud` cannot be resolved or firewall is blocking HTTPS (port 443).
- **Verification**:
  ```powershell
  Resolve-DnsName cctv.corp8.cloud
  Test-NetConnection cctv.corp8.cloud -Port 443
  ```

---

## 2. RTSP Transport & Port Reachability (Step 3)

### Symptom: Port 8554 Blocked
- **Verification (Windows PowerShell)**:
  ```powershell
  Test-NetConnection 103.250.160.189 -Port 8554
  ```
- **Interpretation**:
  - `TcpTestSucceeded : True`: Port 8554 is open and reachable over TCP.
  - `TcpTestSucceeded : False`: Local firewall, corporate router, or ISP is blocking outbound TCP port 8554.
- **Fallback Resolution**:
  Where RTSP port 8554 is blocked by network policy, the authorized HLS endpoint over port 443 can be used:
  ```
  https://cctv.corp8.cloud/<camera_id>/index.m3u8
  ```

### Symptom: OpenCV Cannot Open Stream (`cap.isOpened() == False`)
- **Common Causes**:
  1. RTSP was not forced over TCP. (Default UDP causes packet loss across NAT).
  2. The RTSP URL path format is incorrect.
- **Verification via FFprobe**:
  ```powershell
  ffprobe -rtsp_transport tcp "rtsp://103.250.160.189:8554/stream/cam01"
  ```
- **Verification via FFplay**:
  ```powershell
  ffplay -rtsp_transport tcp "rtsp://103.250.160.189:8554/stream/cam01"
  ```
- **Resolution**:
  Verify `os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp"` is applied before initializing `cv2.VideoCapture`.

---

## 3. Video Codec & Presentation Timestamps (PTS)

### Symptom: H.264 / H.265 Initial Decoder Warnings
- **Log Appearance**:
  ```
  [h264 @ 00000...] non-existing PPS 0 referenced
  [h264 @ 00000...] decode_slice_header error
  [h264 @ 00000...] no frame!
  ```
- **Root Cause**: The client connected mid-stream before the broadcaster sent an IDR/SPS/PPS keyframe.
- **Operational Policy**: **Do not treat initial decode warnings as fatal.** The `RTSPStreamReader` will continue polling until keyframes arrive and valid frames are decoded.

### Symptom: Missing or Zero PTS (`cap.get(CAP_PROP_POS_MSEC) <= 0`)
- **Root Cause**: Certain RTSP streams without SEI timestamp packing or certain codecs report 0 or negative values on early frames.
- **Resolution**:
  - The reader stores `media_pts_ms` as `None` when container PTS is missing.
  - Local monotonic clock (`local_receive_monotonic`) is logged as transport telemetry but never confused with media timeline.

### Symptom: PTS Discontinuity / Loop Detection
- **Log Appearance**:
  ```
  [cam01] PTS DISCONTINUITY (BACKWARDS): PTS jumped backwards from 18450.0ms to 120.0ms
  ```
- **Root Cause**: The sandbox feed is an authentic looped surveillance recording.
- **Resolution**: The framework logs backwards jumps and increments `StreamHealth.pts_discontinuities` without terminating the stream.
