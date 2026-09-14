"""FastAPI Backend Application for Gujarat Police CCTV Command Centre."""
from __future__ import annotations

import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from src.api.routes.cameras import router as cameras_router
from src.api.routes.vehicles import router as vehicles_router
from src.api.routes.watchlist import router as watchlist_router
from src.api.routes.alerts import router as alerts_router
from src.api.routes.dashboard import router as dashboard_router
from src.api.routes.synthetic import router as synthetic_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cctv_api")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"

app = FastAPI(
    title="Gujarat Police CCTV Intelligence Platform API",
    description="Backend API powering the Operator Command Centre (Step 14). Integrates CCTV catalogue, authenticated HLS proxying, ANPR results, watchlist matching, and journey reconstruction.",
    version="1.0.0",
)

# CORS configuration for local React Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount data directory as static evidence endpoint
if DATA_DIR.exists():
    app.mount("/api/evidence", StaticFiles(directory=str(DATA_DIR)), name="evidence")

# Include API routers first
app.include_router(cameras_router)
app.include_router(vehicles_router)
app.include_router(watchlist_router)
app.include_router(alerts_router)
app.include_router(dashboard_router)
app.include_router(synthetic_router)


@app.get("/api/health")
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "Gujarat Police CCTV Intelligence Platform API",
        "version": "1.0.0",
        "steps_supported": "1 through 14"
    }


STANDALONE_HTML = PROJECT_ROOT / "frontend" / "public" / "synthetic-standalone.html"

@app.get("/synthetic-standalone")
def synthetic_standalone():
    """Direct standalone web UI for synthetic video AI vehicle & plate detection."""
    if STANDALONE_HTML.exists():
        return FileResponse(STANDALONE_HTML)
    return {"error": "Standalone HTML template not found"}


# Mount built React frontend if available
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.api.app:app", host="0.0.0.0", port=8000, reload=True)
