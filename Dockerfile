# ==============================================================================
# Gujarat Police CCTV Intelligence Platform — Backend Dockerfile
# ==============================================================================
FROM python:3.11-slim

# Prevent Python from writing bytecode and enable unbuffered standard I/O
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies required for OpenCV, FFmpeg, and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    ffmpeg \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy YOLO weights if available locally
COPY *yolov8*.pt *license_plate*.pt ./

# Copy application source tree and essential metadata
COPY src/ ./src/
COPY data/ ./data/
COPY scripts/ ./scripts/
COPY config/ ./config/

# Ensure runtime directories for footage, snapshots, and uploads exist
RUN mkdir -p \
    data/footage \
    data/snapshots \
    data/detections \
    data/anpr \
    data/synthetic_cache \
    "Synthetic Dataset/uploads"

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
