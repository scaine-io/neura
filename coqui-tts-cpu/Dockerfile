# Multi-stage build to reduce final image size
FROM python:3.9-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    ffmpeg \
    libsndfile1-dev \
    espeak-ng \
    espeak-ng-data \
    libssl-dev \
    libffi-dev \
    python3-dev \
    pkg-config \
    cmake \
    libopenblas-dev \
    gfortran \
    libblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install wheel
RUN pip install --upgrade pip setuptools wheel

# Install numpy and scipy first (base dependencies)
RUN pip install --no-cache-dir numpy scipy

# Install PyTorch CPU version
RUN pip install --no-cache-dir \
    torch==2.0.1+cpu \
    torchvision==0.15.2+cpu \
    torchaudio==2.0.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install audio processing libraries
RUN pip install --no-cache-dir \
    librosa \
    soundfile \
    phonemizer \
    inflect \
    unidecode

# Install TTS and Gradio
RUN pip install --no-cache-dir \
    TTS==0.13.3 \
    gradio

# Runtime stage
FROM python:3.9-slim

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    espeak-ng \
    espeak-ng-data \
    libopenblas0 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"]