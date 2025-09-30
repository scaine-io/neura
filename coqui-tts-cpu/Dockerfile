# Ultra-optimized build for smallest size
FROM python:3.9-slim AS builder

WORKDIR /app

# Install minimal build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    libsndfile1-dev \
    espeak-ng \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip wheel

# Install minimal CPU-only PyTorch (much smaller)
RUN pip install --no-cache-dir --no-deps \
    torch==2.0.1+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Install only essential dependencies (no scipy, librosa for smaller size)
RUN pip install --no-cache-dir \
    numpy \
    soundfile \
    phonemizer \
    inflect \
    unidecode \
    requests \
    pyyaml

# Install minimal TTS (without heavy dependencies)
RUN pip install --no-cache-dir --no-deps TTS==0.13.3

# Install lightweight Gradio
RUN pip install --no-cache-dir gradio

# Final ultra-minimal runtime
FROM python:3.9-slim

# Install only essential runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    espeak-ng \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean \
    && rm -rf /var/cache/apt/* \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

# Copy only Python packages (not the whole venv)
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin/gradio /usr/local/bin/
COPY --from=builder /usr/local/bin/tts /usr/local/bin/

# Minimal app
WORKDIR /app
COPY app.py .

# Remove Python cache files
RUN find /usr/local -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true \
    && find /usr/local -name "*.pyc" -delete \
    && find /usr/local -name "*.pyo" -delete

EXPOSE 7860

CMD ["python", "app.py"]