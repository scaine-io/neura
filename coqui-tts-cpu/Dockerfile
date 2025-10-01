FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    libsndfile1 \
    espeak-ng \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and pin setuptools version to avoid warnings
RUN pip install --upgrade pip
RUN pip install --no-cache-dir "setuptools<81" wheel

# Install PyTorch CPU version first
RUN pip install --no-cache-dir torch==2.0.1+cpu torchvision==0.15.2+cpu torchaudio==2.0.2+cpu --index-url https://download.pytorch.org/whl/cpu

# Install dependencies for TTS
RUN pip install --no-cache-dir \
    numpy \
    scipy \
    librosa \
    soundfile \
    phonemizer \
    inflect \
    unidecode

# Install TTS with specific version
RUN pip install --no-cache-dir TTS==0.13.3

# Install compatible Gradio version
RUN pip install --no-cache-dir gradio==3.50.2

COPY app.py .

EXPOSE 7860

CMD ["python", "app.py"]