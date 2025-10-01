# Optimized build with required dependencies
FROM python:3.9-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    libsndfile1-dev \
    espeak-ng \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip wheel

# Install PyTorch CPU-only (smaller than full version)
RUN pip install --no-cache-dir \
    torch==2.0.1+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install required dependencies (TTS needs scipy)
RUN pip install --no-cache-dir \
    numpy \
    scipy \
    soundfile \
    phonemizer \
    inflect \
    unidecode \
    requests \
    pyyaml \
    librosa

# Install TTS and Gradio
RUN pip install --no-cache-dir \
    TTS==0.13.3 \
    gradio

# Runtime stage
FROM python:3.9-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    espeak-ng \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin/tts /usr/local/bin/
COPY --from=builder /usr/local/bin/gradio /usr/local/bin/

WORKDIR /app
COPY app.py .

# Clean up cache files
RUN find /usr/local -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true \
    && find /usr/local -name "*.pyc" -delete

EXPOSE 7860

CMD ["python", "app.py"]