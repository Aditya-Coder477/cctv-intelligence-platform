"""FastAPI Route for Live Synthetic Dataset Video Vehicle & Plate Detection + Real-time Watchlist Matching.

Features:
1. List available synthetic dataset videos (including uploaded videos).
2. Upload custom videos for instant AI processing.
3. Stream video with real-time YOLOv8 vehicle detection + YOLO license plate detection + EasyOCR.
4. Real-time correlation against classified law-enforcement watchlist (Stolen, Wanted, Missing, Blacklisted, Suspect).
5. Visual Alert Overlay: Red pulsating HUD boxes, case details, and alert banners in video stream.
6. Real-time alert generation, dispatch events, and persistent audit trail for Command Centre integration.
"""
from __future__ import annotations

import cv2
import json
import logging
import os
import shutil
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Generator, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor

import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, JSONResponse, Response, StreamingResponse
from ultralytics import YOLO

logger = logging.getLogger("synthetic_api")

router = APIRouter(prefix="/api/synthetic", tags=["synthetic"])

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
SYNTHETIC_DIR = PROJECT_ROOT / "Synthetic Dataset"
CACHE_DIR = PROJECT_ROOT / "data" / "synthetic_cache"
THUMBNAIL_DIR = CACHE_DIR / "thumbnails"
SNAPSHOT_DIR = CACHE_DIR / "snapshots"
UPLOADS_DIR = SYNTHETIC_DIR / "uploads"
SYNTHETIC_WATCHLIST_PATH = PROJECT_ROOT / "data" / "watchlist" / "vehicles" / "synthetic_watchlist.json"
CENTRAL_WATCHLIST_PATH = PROJECT_ROOT / "data" / "watchlist" / "vehicles" / "watchlist.json"
MATCHES_FILE = PROJECT_ROOT / "data" / "matches" / "confirmed" / "matches.jsonl"
ALERTS_STATE_FILE = PROJECT_ROOT / "data" / "matches" / "alerts_state.json"

THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)
SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
MATCHES_FILE.parent.mkdir(parents=True, exist_ok=True)

# ─── Load AI Models (Lazy Loaded / Shared) ──────────────────────────────────
_yolo_veh_model: Optional[YOLO] = None
_yolo_lp_model: Optional[YOLO] = None
_ocr_reader = None
_AI_EXECUTOR = ThreadPoolExecutor(max_workers=2, thread_name_prefix="synthetic_ai_worker")

def get_yolo_veh() -> YOLO:
    global _yolo_veh_model
    if _yolo_veh_model is None:
        model_path = PROJECT_ROOT / "yolov8n.pt"
        if not model_path.exists():
            model_path = PROJECT_ROOT / "weights" / "yolov8n.pt"
        logger.info(f"Loading YOLO Vehicle model from {model_path}")
        _yolo_veh_model = YOLO(str(model_path) if model_path.exists() else "yolov8n.pt")
    return _yolo_veh_model

def get_yolo_lp() -> Optional[YOLO]:
    global _yolo_lp_model
    if _yolo_lp_model is None:
        model_path = PROJECT_ROOT / "license_plate_detector.pt"
        if not model_path.exists():
            model_path = PROJECT_ROOT / "weights" / "license_plate_detector.pt"
        if model_path.exists():
            logger.info(f"Loading YOLO LP model from {model_path}")
            _yolo_lp_model = YOLO(str(model_path))
        else:
            logger.warning(f"License plate model not found at {model_path}")
    return _yolo_lp_model

def get_ocr():
    global _ocr_reader
    if _ocr_reader is None:
        try:
            import easyocr
            logger.info("Initializing EasyOCR reader (en, gpu=False/auto)...")
            _ocr_reader = easyocr.Reader(["en"], gpu=False, verbose=False)
        except Exception as e:
            logger.warning(f"Failed to initialize EasyOCR: {e}")
            _ocr_reader = False
    return _ocr_reader if _ocr_reader is not False else None


# ─── Watchlist & Real-Time Alerts In-Memory Store ───────────────────────────
_WATCHLIST_INDEX: Dict[str, Dict[str, Any]] = {}
_SESSION_DETECTIONS: Dict[str, Dict[str, Any]] = {}
_SESSION_ALERTS: Dict[str, List[Dict[str, Any]]] = {}


def _levenshtein(s1: str, s2: str) -> int:
    """Compute Levenshtein distance between two normalized strings."""
    if len(s1) < len(s2):
        return _levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


def get_watchlist_index() -> Dict[str, Dict[str, Any]]:
    """Retrieve indexed watchlist targets with fast normalized hash lookup."""
    global _WATCHLIST_INDEX
    if not _WATCHLIST_INDEX:
        target = SYNTHETIC_WATCHLIST_PATH if SYNTHETIC_WATCHLIST_PATH.exists() else CENTRAL_WATCHLIST_PATH
        if target.exists():
            try:
                with open(target, "r", encoding="utf-8") as f:
                    records = json.load(f)
                for r in records:
                    norm = r.get("normalized_registration_number", r.get("registration_number", "")).upper().replace(" ", "").replace("-", "")
                    if norm:
                        _WATCHLIST_INDEX[norm] = r
                logger.info(f"Loaded {len(_WATCHLIST_INDEX)} watchlist records for real-time CCTV correlation")
            except Exception as e:
                logger.error(f"Error loading watchlist: {e}")
    return _WATCHLIST_INDEX


def correlate_plate(plate_text: str) -> Optional[Tuple[Dict[str, Any], float, str]]:
    """Correlate recognized plate with classified watchlist database."""
    if not plate_text:
        return None
    norm_query = plate_text.upper().replace(" ", "").replace("-", "").strip()
    w_index = get_watchlist_index()

    # 1. Exact match
    if norm_query in w_index:
        return (w_index[norm_query], 1.0, "EXACT_MATCH")

    # 2. Fuzzy match for single OCR error / character discrepancy
    if len(norm_query) >= 4:
        for target_norm, target_entry in w_index.items():
            if abs(len(norm_query) - len(target_norm)) <= 1:
                if _levenshtein(norm_query, target_norm) <= 1:
                    return (target_entry, 0.88, "FUZZY_MATCH")

    return None


def persist_alert_match(alert: Dict[str, Any]) -> None:
    """Persist generated alert match into platform matches store."""
    try:
        # 1. Append to matches.jsonl
        line = json.dumps({
            "match_id": alert["alert_id"],
            "observation_id": f"OBS-{alert['video']}-{alert['track_id']}",
            "decision": "MATCH",
            "decision_reason": alert["match_type"],
            "registration_number": alert["registration_number"],
            "normalized_registration_number": alert["registration_number"],
            "watchlist_id": alert.get("watchlist_id"),
            "watchlist_match_score": alert["match_score"],
            "camera_id": f"synthetic_{alert['video'].split('.')[0]}",
            "track_id": alert["track_id"],
            "matched_at_utc": alert["timestamp_iso"],
            "watchlist_metadata": {
                "category": alert["category"],
                "priority": alert["priority"],
                "description": alert["description"],
                "case_number": alert.get("case_number", ""),
                "jurisdiction": alert.get("jurisdiction", "Gujarat Police"),
            }
        })
        with open(MATCHES_FILE, "a", encoding="utf-8") as f:
            f.write(line + "\n")

        # 2. Update alerts_state.json
        state = {}
        if ALERTS_STATE_FILE.exists():
            try:
                with open(ALERTS_STATE_FILE, "r", encoding="utf-8") as f:
                    state = json.load(f)
            except Exception:
                state = {}
        if alert["alert_id"] not in state:
            state[alert["alert_id"]] = {
                "status": "NEW",
                "audit_history": [{
                    "timestamp": alert["timestamp_iso"],
                    "action": "TRIGGERED",
                    "operator": "AI Synthetic Surveillance Engine",
                    "notes": f"Match detected with score {alert['match_score']:.2f} via {alert['match_type']} ({alert['category']})"
                }]
            }
            with open(ALERTS_STATE_FILE, "w", encoding="utf-8") as f:
                json.dump(state, f, indent=2)
    except Exception as e:
        logger.warning(f"Failed to persist alert to central store: {e}")


# ─── Lightweight Centroid / IoU Tracker ─────────────────────────────────────
class SimpleVehicleTracker:
    def __init__(self, max_disappeared: int = 20, iou_threshold: float = 0.25):
        self.next_id = 1
        self.objects: Dict[int, Tuple[int, int, int, int]] = {}
        self.disappeared: Dict[int, int] = {}
        self.labels: Dict[int, str] = {}
        self.first_seen: Dict[int, float] = {}
        self.last_seen: Dict[int, float] = {}
        self.max_disappeared = max_disappeared
        self.iou_threshold = iou_threshold

    @staticmethod
    def _compute_iou(boxA, boxB):
        xA = max(boxA[0], boxB[0])
        yA = max(boxA[1], boxB[1])
        xB = min(boxA[2], boxB[2])
        yB = min(boxA[3], boxB[3])
        interArea = max(0, xB - xA) * max(0, yB - yA)
        boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
        boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
        denom = float(boxAArea + boxBArea - interArea)
        return interArea / denom if denom > 0 else 0.0

    def update(self, rects: List[Tuple[int, int, int, int, str, float]], current_time: float) -> List[Tuple[int, int, int, int, int, str, float]]:
        if len(rects) == 0:
            for object_id in list(self.disappeared.keys()):
                self.disappeared[object_id] += 1
                if self.disappeared[object_id] > self.max_disappeared:
                    del self.objects[object_id]
                    del self.disappeared[object_id]
            return []

        if len(self.objects) == 0:
            results = []
            for (x1, y1, x2, y2, cls_name, conf) in rects:
                obj_id = self.next_id
                self.next_id += 1
                self.objects[obj_id] = (x1, y1, x2, y2)
                self.disappeared[obj_id] = 0
                self.labels[obj_id] = cls_name
                self.first_seen[obj_id] = current_time
                self.last_seen[obj_id] = current_time
                results.append((obj_id, x1, y1, x2, y2, cls_name, conf))
            return results

        object_ids = list(self.objects.keys())
        previous_boxes = [self.objects[oid] for oid in object_ids]
        matched_new = set()
        matched_old = set()
        results = []

        for i, new_box in enumerate(rects):
            best_iou = self.iou_threshold
            best_j = -1
            for j, old_box in enumerate(previous_boxes):
                if j in matched_old:
                    continue
                iou = self._compute_iou(new_box[:4], old_box)
                if iou > best_iou:
                    best_iou = iou
                    best_j = j
            if best_j >= 0:
                matched_new.add(i)
                matched_old.add(best_j)
                obj_id = object_ids[best_j]
                self.objects[obj_id] = new_box[:4]
                self.disappeared[obj_id] = 0
                self.labels[obj_id] = new_box[4]
                self.last_seen[obj_id] = current_time
                results.append((obj_id, new_box[0], new_box[1], new_box[2], new_box[3], new_box[4], new_box[5]))

        for i, new_box in enumerate(rects):
            if i not in matched_new:
                obj_id = self.next_id
                self.next_id += 1
                self.objects[obj_id] = new_box[:4]
                self.disappeared[obj_id] = 0
                self.labels[obj_id] = new_box[4]
                self.first_seen[obj_id] = current_time
                self.last_seen[obj_id] = current_time
                results.append((obj_id, new_box[0], new_box[1], new_box[2], new_box[3], new_box[4], new_box[5]))

        for j, obj_id in enumerate(object_ids):
            if j not in matched_old:
                self.disappeared[obj_id] += 1
                if self.disappeared[obj_id] > self.max_disappeared:
                    del self.objects[obj_id]
                    del self.disappeared[obj_id]

        return results


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.get("/videos")
def list_synthetic_videos():
    """List all available synthetic videos (both pre-loaded 8 and uploads)."""
    videos = []
    video_files = list(SYNTHETIC_DIR.glob("*.mp4")) + list(UPLOADS_DIR.glob("*.mp4"))
    
    def sort_key(p: Path):
        stem = p.stem
        if stem.isdigit():
            return (0, int(stem))
        return (1, stem)

    video_files = sorted(video_files, key=sort_key)

    for p in video_files:
        is_upload = "uploads" in str(p)
        vid_id = f"upload_{p.name}" if is_upload else p.name
        
        cap = cv2.VideoCapture(str(p))
        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1920
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 1080
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        fc = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
        dur = round(fc / fps, 1) if fps > 0 else 0.0
        cap.release()

        size_mb = round(p.stat().st_size / (1024 * 1024), 1)

        videos.append({
            "id": vid_id,
            "filename": p.name,
            "path": str(p.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "display_name": f"Custom Upload: {p.name}" if is_upload else f"Synthetic Camera Feed {p.stem}",
            "width": w,
            "height": h,
            "fps": round(fps, 1),
            "frame_count": fc,
            "duration_sec": dur,
            "size_mb": size_mb,
            "is_upload": is_upload,
            "thumbnail_url": f"/api/synthetic/thumbnail/{p.name}"
        })

    return videos


@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a new video for live vehicle and plate detection."""
    allowed_exts = {".mp4", ".avi", ".mov", ".mkv", ".webm"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"Unsupported format. Allowed: {', '.join(allowed_exts)}")

    safe_name = Path(file.filename).name.replace(" ", "_")
    target_path = UPLOADS_DIR / safe_name
    
    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    logger.info(f"Uploaded custom video: {target_path} ({target_path.stat().st_size / 1024 / 1024:.1f} MB)")
    _generate_thumbnail_if_needed(target_path, safe_name)

    return {
        "status": "success",
        "message": f"Video '{safe_name}' uploaded successfully.",
        "filename": safe_name,
        "is_upload": True,
        "thumbnail_url": f"/api/synthetic/thumbnail/{safe_name}"
    }


def _generate_thumbnail_if_needed(video_path: Path, filename: str) -> Path:
    thumb_path = THUMBNAIL_DIR / f"{filename}.jpg"
    if not thumb_path.exists():
        cap = cv2.VideoCapture(str(video_path))
        cap.set(cv2.CAP_PROP_POS_FRAMES, 15)
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ret, frame = cap.read()
        cap.release()
        
        if ret and frame is not None:
            thumb = cv2.resize(frame, (480, 270))
            cv2.imwrite(str(thumb_path), thumb, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    return thumb_path


@router.get("/thumbnail/{filename}")
def get_video_thumbnail(filename: str):
    """Retrieve video thumbnail image."""
    thumb_path = THUMBNAIL_DIR / f"{filename}.jpg"
    if not thumb_path.exists():
        v_path = SYNTHETIC_DIR / filename
        if not v_path.exists():
            v_path = UPLOADS_DIR / filename
        if v_path.exists():
            _generate_thumbnail_if_needed(v_path, filename)
    
    if thumb_path.exists():
        return FileResponse(thumb_path, media_type="image/jpeg")
    
    blank = np.zeros((180, 320, 3), dtype=np.uint8)
    _, buf = cv2.imencode(".jpg", blank)
    return Response(content=buf.tobytes(), media_type="image/jpeg")


@router.get("/watchlist")
def get_synthetic_watchlist():
    """Retrieve representative watchlist database classified into police categories."""
    target = SYNTHETIC_WATCHLIST_PATH if SYNTHETIC_WATCHLIST_PATH.exists() else CENTRAL_WATCHLIST_PATH
    if target.exists():
        try:
            with open(target, "r", encoding="utf-8") as f:
                records = json.load(f)
            return {
                "total_targets": len(records),
                "categories": list(set(r.get("category") for r in records if r.get("category"))),
                "watchlist": records
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"total_targets": 0, "categories": [], "watchlist": []}


@router.get("/detections")
def get_session_detections(video: str = Query(..., description="Video filename")):
    """Get active vehicle detections for the given video."""
    session = _SESSION_DETECTIONS.get(video, {})
    results = sorted(session.values(), key=lambda x: x.get("last_seen_sec", 0), reverse=True)
    alerts = _SESSION_ALERTS.get(video, [])
    return {
        "video": video,
        "total_detected": len(results),
        "total_plates_identified": sum(1 for r in results if r.get("plate_number")),
        "total_alerts": len(alerts),
        "vehicles": results,
        "recent_alerts": alerts[-10:] if alerts else []
    }


@router.get("/alerts")
def get_session_alerts(video: Optional[str] = Query(None)):
    """Get all real-time alerts generated from synthetic detection & database matching."""
    if video:
        return _SESSION_ALERTS.get(video, [])
    all_alerts = []
    for vid, a_list in _SESSION_ALERTS.items():
        all_alerts.extend(a_list)
    return sorted(all_alerts, key=lambda a: a.get("detected_at_sec", 0), reverse=True)


@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, operator: str = Query("Operator")):
    """Operator acknowledgement of real-time watchlist match alert."""
    found = False
    for a_list in _SESSION_ALERTS.values():
        for a in a_list:
            if a.get("alert_id") == alert_id:
                a["status"] = "ACKNOWLEDGED"
                a["acknowledged_by"] = operator
                a["acknowledged_at"] = datetime.now(timezone.utc).isoformat()
                found = True
                break
    if found:
        return {"status": "success", "alert_id": alert_id, "action": "ACKNOWLEDGED"}
    raise HTTPException(status_code=404, detail="Alert not found")


@router.get("/snapshot/{filename}")
def get_snapshot_image(filename: str):
    """Return cropped vehicle or plate snapshot."""
    file_path = SNAPSHOT_DIR / filename
    if file_path.exists():
        return FileResponse(file_path, media_type="image/jpeg")
    raise HTTPException(status_code=404, detail="Snapshot not found")


@router.post("/reset-session")
def reset_session(video: str = Query(...)):
    """Clear in-memory detections and alerts for a fresh video analysis."""
    if video in _SESSION_DETECTIONS:
        _SESSION_DETECTIONS[video].clear()
    if video in _SESSION_ALERTS:
        _SESSION_ALERTS[video].clear()
    return {"status": "cleared", "video": video}


# ─── Live MJPEG Video Stream with AI Annotations & Watchlist Matching ────────

def _async_plate_worker(
    video: str,
    trk_id: int,
    cls_name: str,
    v_conf: float,
    veh_crop: np.ndarray,
    current_time_sec: float,
    cx1: int,
    cy1: int,
    plate_cache: dict,
    session_data: dict,
    session_alerts: list,
    alerted_tracks: set,
    plate_conf: float,
):
    """Background AI worker for plate detection, EasyOCR, and watchlist correlation."""
    try:
        yolo_lp = get_yolo_lp()
        ocr_engine = get_ocr()
        detected_text = ""
        ocr_score = 0.5
        plate_coords = None
        veh_snap_name = f"{video}_TRK_{trk_id:04d}_veh.jpg"
        plt_snap_name = f"{video}_TRK_{trk_id:04d}_plt.jpg"

        if yolo_lp is not None and veh_crop.size > 0:
            lp_res = yolo_lp(veh_crop, conf=plate_conf, imgsz=320, verbose=False)[0]
            if len(lp_res.boxes) > 0:
                best_lp = max(lp_res.boxes, key=lambda b: float(b.conf[0]))
                lpx1, lpy1, lpx2, lpy2 = map(int, best_lp.xyxy[0].tolist())
                lp_score = float(best_lp.conf[0])
                plate_crop = veh_crop[lpy1:lpy2, lpx1:lpx2]
                plate_coords = (cx1 + lpx1, cy1 + lpy1, cx1 + lpx2, cy1 + lpy2)

                if ocr_engine is not None and plate_crop.size > 0 and (lpx2 - lpx1) > 15:
                    try:
                        gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)
                        gray = cv2.resize(gray, (0, 0), fx=2.0, fy=2.0, interpolation=cv2.INTER_CUBIC)
                        ocr_res = ocr_engine.readtext(gray, detail=1, allowlist="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
                        if ocr_res:
                            raw_tokens = [r[1].upper() for r in ocr_res if len(r[1]) >= 2]
                            detected_text = "".join(raw_tokens).replace(" ", "")
                            ocr_score = max([r[2] for r in ocr_res])
                    except Exception as e:
                        logger.debug(f"OCR error on track {trk_id}: {e}")

                # Save crops to disk asynchronously in background worker
                try:
                    cv2.imwrite(str(SNAPSHOT_DIR / veh_snap_name), veh_crop)
                    if plate_crop.size > 0:
                        cv2.imwrite(str(SNAPSHOT_DIR / plt_snap_name), plate_crop)
                except Exception as e:
                    logger.debug(f"Snapshot write error: {e}")

        if not detected_text or len(detected_text) < 3:
            detected_text = f"PLT-{trk_id:04d}"

        # Correlate with classified watchlist
        match_res = correlate_plate(detected_text)
        is_match = match_res is not None

        # Update cache for live stream overlay (atomic dictionary update in CPython)
        plate_cache[trk_id] = (detected_text, ocr_score, plate_coords, match_res)

        # Update session data
        track_key = f"TRK-{trk_id:04d}"
        session_data[track_key] = {
            "track_id": track_key,
            "vehicle_type": cls_name,
            "vehicle_confidence": round(v_conf, 2),
            "plate_number": detected_text,
            "plate_confidence": round(ocr_score, 2),
            "is_watchlist_match": is_match,
            "watchlist_category": match_res[0].get("category") if is_match else None,
            "watchlist_priority": match_res[0].get("priority") if is_match else None,
            "case_number": match_res[0].get("case_number") if is_match else None,
            "watchlist_description": match_res[0].get("description") if is_match else None,
            "first_seen_sec": current_time_sec,
            "last_seen_sec": current_time_sec,
            "vehicle_snapshot_url": f"/api/synthetic/snapshot/{veh_snap_name}",
            "plate_snapshot_url": f"/api/synthetic/snapshot/{plt_snap_name}",
        }

        # Real-time alert generation upon successful match
        if is_match and trk_id not in alerted_tracks:
            alerted_tracks.add(trk_id)
            target_entry, m_score, m_type = match_res
            alert_id = f"ALT-{video.split('.')[0]}-{track_key}-{int(current_time_sec * 10)}"
            new_alert = {
                "alert_id": alert_id,
                "video": video,
                "track_id": track_key,
                "registration_number": detected_text,
                "watchlist_id": target_entry.get("watchlist_id"),
                "category": target_entry.get("category", "SUSPECT_VEHICLE"),
                "priority": target_entry.get("priority", "HIGH"),
                "description": target_entry.get("description", "Watchlist target match identified"),
                "case_number": target_entry.get("case_number", "CASE-SYN"),
                "jurisdiction": target_entry.get("jurisdiction", "Gujarat Police Command Centre"),
                "match_type": m_type,
                "match_score": m_score,
                "detected_at_sec": current_time_sec,
                "timestamp_iso": datetime.now(timezone.utc).isoformat(),
                "vehicle_snapshot_url": f"/api/synthetic/snapshot/{veh_snap_name}",
                "plate_snapshot_url": f"/api/synthetic/snapshot/{plt_snap_name}",
                "status": "NEW"
            }
            session_alerts.append(new_alert)
            persist_alert_match(new_alert)
            logger.info(f"🚨 REAL-TIME ALERT: {detected_text} -> {target_entry.get('category')} ({target_entry.get('priority')})")
    except Exception as e:
        logger.warning(f"Error in _async_plate_worker for track {trk_id}: {e}")


@router.get("/stream")
def stream_synthetic_video(
    video: str = Query(..., description="Filename e.g. 1.mp4 or upload_foo.mp4"),
    detector_interval: int = Query(3, ge=1, le=10, description="Run YOLO every N frames"),
    conf: float = Query(0.25, ge=0.05, le=0.9, description="Vehicle confidence threshold"),
    plate_conf: float = Query(0.15, ge=0.05, le=0.9, description="Plate confidence threshold"),
    target_fps: int = Query(20, ge=5, le=60, description="Target streaming framerate"),
    resize_w: int = Query(720, ge=480, le=1920, description="Output streaming width"),
    loop: bool = Query(True, description="Loop video automatically"),
):
    """High-performance real-time MJPEG stream with non-blocking async AI pipeline."""
    video_path = SYNTHETIC_DIR / video
    if not video_path.exists():
        video_path = UPLOADS_DIR / video
    if not video_path.exists():
        raise HTTPException(status_code=404, detail=f"Video '{video}' not found.")

    get_watchlist_index()

    def frame_generator() -> Generator[bytes, None, None]:
        cap = cv2.VideoCapture(str(video_path))
        if not cap.isOpened():
            logger.error(f"Cannot open video: {video_path}")
            return

        tracker = SimpleVehicleTracker(max_disappeared=20, iou_threshold=0.25)
        yolo_veh = get_yolo_veh()

        # Session stores
        if video not in _SESSION_DETECTIONS:
            _SESSION_DETECTIONS[video] = {}
        if video not in _SESSION_ALERTS:
            _SESSION_ALERTS[video] = []
        session_data = _SESSION_DETECTIONS[video]
        session_alerts = _SESSION_ALERTS[video]

        frame_idx = 0
        prev_rects = []
        video_fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_delay = 1.0 / target_fps
        stream_start_wall = time.time()

        # Palette (BGR)
        CYAN = (255, 240, 0)
        EMERALD = (118, 230, 0)
        AMBER = (0, 191, 255)
        ALERT_RED = (25, 25, 255)
        ALERT_BG = (20, 10, 80)
        BG_DARK = (18, 18, 24)

        VEH_CLASSES = [2, 3, 5, 7]
        CLASS_NAMES = {2: "Car", 3: "Motorcycle", 5: "Bus", 7: "Truck"}

        # Plate text cache per track_id
        plate_cache: Dict[int, Tuple[str, float, Optional[Tuple[int, int, int, int]], Optional[Tuple[Dict, float, str]]]] = {}
        pending_plates: set = set()
        alerted_tracks: set = set()

        try:
            while True:
                t_frame_start = time.time()

                # Wall-clock real-time synchronization: skip frames if previous AI cycle took longer
                wall_elapsed = time.time() - stream_start_wall
                target_video_frame = int(wall_elapsed * video_fps)
                frames_to_skip = target_video_frame - frame_idx
                if frames_to_skip > 0:
                    for _ in range(min(frames_to_skip, 12)):
                        cap.grab()
                        frame_idx += 1

                ret, frame = cap.read()
                if not ret or frame is None:
                    if loop:
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        frame_idx = 0
                        stream_start_wall = time.time()
                        continue
                    else:
                        break

                frame_idx += 1
                orig_h, orig_w = frame.shape[:2]

                # Fast bilinear resize to target width (720p / 640p)
                target_w = resize_w
                if orig_w > target_w:
                    scale = target_w / float(orig_w)
                    out_h = int(orig_h * scale)
                    out_w = target_w
                    stream_frame = cv2.resize(frame, (out_w, out_h), interpolation=cv2.INTER_LINEAR)
                else:
                    out_h, out_w = orig_h, orig_w
                    stream_frame = frame.copy()

                current_time_sec = round(frame_idx / video_fps, 2)

                # ── 1. Vehicle Detection (Fast imgsz=384, runs every N frames) ──
                if (frame_idx % detector_interval) == 0:
                    rects = []
                    results = yolo_veh(stream_frame, classes=VEH_CLASSES, conf=conf, imgsz=384, verbose=False)[0]
                    for box in results.boxes:
                        bx1, by1, bx2, by2 = map(int, box.xyxy[0].tolist())
                        cls_id = int(box.cls[0])
                        c_score = float(box.conf[0])
                        cls_name = CLASS_NAMES.get(cls_id, "Vehicle")
                        rects.append((bx1, by1, bx2, by2, cls_name, c_score))
                    prev_rects = rects
                else:
                    rects = prev_rects

                # ── 2. Fast IoU Tracking (< 1ms) ──────────────────────────────
                tracked_vehicles = tracker.update(rects, current_time_sec)

                # ── 3. Non-Blocking Async Plate Detection & OCR Dispatch ──────
                active_alert_in_frame = None

                for (trk_id, vx1, vy1, vx2, vy2, cls_name, v_conf) in tracked_vehicles:
                    vw = vx2 - vx1
                    vh = vy2 - vy1

                    if trk_id not in plate_cache and trk_id not in pending_plates and vw >= 40 and vh >= 30:
                        pending_plates.add(trk_id)
                        plate_cache[trk_id] = (None, 0.0, None, None)  # Mark as scanning

                        pad_x = int(vw * 0.05)
                        pad_y = int(vh * 0.05)
                        cx1 = max(0, vx1 - pad_x)
                        cy1 = max(0, vy1 - pad_y)
                        cx2 = min(out_w, vx2 + pad_x)
                        cy2 = min(out_h, vy2 + pad_y)
                        veh_crop = stream_frame[cy1:cy2, cx1:cx2].copy()

                        # Offload to background worker thread (STREAM NEVER WAITS FOR OCR)
                        _AI_EXECUTOR.submit(
                            _async_plate_worker,
                            video,
                            trk_id,
                            cls_name,
                            v_conf,
                            veh_crop,
                            current_time_sec,
                            cx1,
                            cy1,
                            plate_cache,
                            session_data,
                            session_alerts,
                            alerted_tracks,
                            plate_conf,
                        )

                    track_key = f"TRK-{trk_id:04d}"
                    if track_key in session_data:
                        session_data[track_key]["last_seen_sec"] = current_time_sec

                # ── 4. Render Surveillance HUD Overlays ───────────────────────
                for (trk_id, vx1, vy1, vx2, vy2, cls_name, v_conf) in tracked_vehicles:
                    plate_info = plate_cache.get(trk_id)
                    plate_text = plate_info[0] if plate_info else None
                    plate_coords = plate_info[2] if plate_info else None
                    match_info = plate_info[3] if plate_info else None
                    is_match = match_info is not None

                    if is_match:
                        active_alert_in_frame = match_info

                    box_color = ALERT_RED if is_match else CYAN
                    box_thickness = 3 if is_match else 2

                    # A. Main Vehicle Box
                    cv2.rectangle(stream_frame, (vx1, vy1), (vx2, vy2), box_color, box_thickness)

                    # B. Corner Bracket Reticles
                    corner_len = min(22, max(8, (vx2 - vx1) // 5))
                    reticle_thickness = 3 if is_match else 2
                    cv2.line(stream_frame, (vx1, vy1), (vx1 + corner_len, vy1), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx1, vy1), (vx1, vy1 + corner_len), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx2, vy1), (vx2 - corner_len, vy1), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx2, vy1), (vx2, vy1 + corner_len), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx1, vy2), (vx1 + corner_len, vy2), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx1, vy2), (vx1, vy2 - corner_len), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx2, vy2), (vx2 - corner_len, vy2), box_color, reticle_thickness)
                    cv2.line(stream_frame, (vx2, vy2), (vx2, vy2 - corner_len), box_color, reticle_thickness)

                    # C. Vehicle ID & Plate HUD Badge
                    badge_h = 54 if is_match else 40
                    badge_w = 250 if is_match else 220
                    by1 = max(45, vy1 - badge_h)
                    by2 = vy1
                    bx1 = max(5, vx1)
                    bx2 = min(out_w - 5, bx1 + badge_w)

                    sub_badge = stream_frame[by1:by2, bx1:bx2]
                    if sub_badge.size > 0:
                        overlay = sub_badge.copy()
                        fill_color = ALERT_BG if is_match else BG_DARK
                        cv2.rectangle(overlay, (0, 0), (bx2 - bx1, by2 - by1), fill_color, -1)
                        cv2.addWeighted(overlay, 0.88, sub_badge, 0.12, 0, sub_badge)
                        cv2.rectangle(stream_frame, (bx1, by1), (bx2, by2), box_color, 1)

                    if is_match:
                        target_entry, m_score, _ = match_info
                        cat_label = target_entry.get("category", "MATCH").replace("_", " ")
                        prio_label = target_entry.get("priority", "HIGH")
                        cv2.putText(stream_frame, f"ALERT: {cat_label} [{prio_label}]", (bx1 + 6, by1 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 1, cv2.LINE_AA)
                        cv2.putText(stream_frame, f"ID: TRK-{trk_id:04d} | {plate_text}", (bx1 + 6, by1 + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)
                        case_ref = target_entry.get("case_number", "")
                        cv2.putText(stream_frame, f"CASE: {case_ref}", (bx1 + 6, by1 + 47), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (200, 200, 255), 1, cv2.LINE_AA)
                    else:
                        txt_id = f"ID: TRK-{trk_id:04d} | {cls_name.upper()}"
                        cv2.putText(stream_frame, txt_id, (bx1 + 6, by1 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)
                        if plate_text:
                            txt_plt = f"PLATE: {plate_text}"
                            col_plt = EMERALD
                        else:
                            txt_plt = "PLATE: SCANNING..."
                            col_plt = AMBER
                        cv2.putText(stream_frame, txt_plt, (bx1 + 6, by1 + 33), cv2.FONT_HERSHEY_SIMPLEX, 0.44, col_plt, 1, cv2.LINE_AA)

                    # D. License Plate Target Box
                    if plate_coords:
                        px1, py1, px2, py2 = plate_coords
                        lp_box_col = ALERT_RED if is_match else EMERALD
                        cv2.rectangle(stream_frame, (px1, py1), (px2, py2), lp_box_col, 2)
                        cv2.putText(stream_frame, f"LP: {plate_text}", (px1, max(15, py1 - 4)), cv2.FONT_HERSHEY_SIMPLEX, 0.38, lp_box_col, 1, cv2.LINE_AA)

                # ── 5. Top Telemetry HUD Overlay Bar ──────────────────────────
                hud_overlay = stream_frame[0:40, 0:out_w].copy()
                hud_bg_color = (15, 10, 60) if active_alert_in_frame else (12, 16, 24)
                cv2.rectangle(hud_overlay, (0, 0), (out_w, 40), hud_bg_color, -1)
                cv2.addWeighted(hud_overlay, 0.88, stream_frame[0:40, 0:out_w], 0.12, 0, stream_frame[0:40, 0:out_w])

                banner_line_color = ALERT_RED if active_alert_in_frame else CYAN
                cv2.line(stream_frame, (0, 40), (out_w, 40), banner_line_color, 2 if active_alert_in_frame else 1)

                active_count = len(tracked_vehicles)
                locked_plates = sum(1 for (tid, *_) in tracked_vehicles if tid in plate_cache and plate_cache[tid][0])
                pts_str = time.strftime('%M:%S', time.gmtime(current_time_sec)) + f".{int((current_time_sec % 1)*100):02d}"

                if active_alert_in_frame:
                    tgt, _, _ = active_alert_in_frame
                    hud_left = f"[🚨 ALERT] {tgt.get('registration_number')} | {tgt.get('category')} ({tgt.get('priority')})"
                    hud_right = f"PTS: {pts_str} | ALERTS: {len(session_alerts)}"
                    cv2.putText(stream_frame, hud_left, (12, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 255, 255), 1, cv2.LINE_AA)
                    cv2.putText(stream_frame, hud_right, (max(12, out_w - 270), 25), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (255, 255, 255), 1, cv2.LINE_AA)
                else:
                    hud_left = f"[CCTV AI HUD] FEED: {video.upper()} | {out_w}x{out_h}"
                    hud_right = f"PTS: {pts_str} | TRACKS: {active_count} | LOCKED: {locked_plates} | ALERTS: {len(session_alerts)}"
                    cv2.putText(stream_frame, hud_left, (12, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.44, CYAN, 1, cv2.LINE_AA)
                    cv2.putText(stream_frame, hud_right, (max(12, out_w - 420), 25), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (220, 240, 255), 1, cv2.LINE_AA)

                # ── 6. Encode JPEG and Yield (Quality 70 = Fast & Crisp) ───────
                _, buffer = cv2.imencode(".jpg", stream_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")

                elapsed = time.time() - t_frame_start
                if elapsed < frame_delay:
                    time.sleep(frame_delay - elapsed)

        finally:
            cap.release()

    return StreamingResponse(frame_generator(), media_type="multipart/x-mixed-replace; boundary=frame")
