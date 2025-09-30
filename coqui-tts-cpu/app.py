import gradio as gr
import tempfile
from TTS.api import TTS
import os

# Initialize TTS with CPU-only model
print("🔧 Initializing TTS model...")
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False)
print("✅ TTS model loaded successfully!")

def generate_speech(text):
    """Generate speech using Coqui TTS"""
    try:
        if not text or not text.strip():
            return None
            
        print(f"🎤 Generating speech for: {text[:50]}...")
        output_file = tempfile.mktemp(suffix=".wav")
        
        # Generate speech to file
        tts.tts_to_file(text=text, file_path=output_file)
        
        if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
            print("✅ Speech generated successfully!")
            return output_file
        else:
            print("❌ Failed to generate audio file")
            return None
            
    except Exception as e:
        print(f"❌ Error generating speech: {str(e)}")
        return None

# Simple Gradio interface without complex schemas
def create_interface():
    with gr.Blocks() as demo:
        gr.Markdown("# 🎤 Coqui TTS (CPU)")
        gr.Markdown("High-quality text-to-speech using Coqui TTS on CPU")
        
        with gr.Row():
            with gr.Column():
                text_input = gr.Textbox(
                    label="Text to Convert",
                    placeholder="Enter text to convert to speech...",
                    lines=3
                )
                generate_btn = gr.Button("🎵 Generate Speech", variant="primary")
            
            with gr.Column():
                audio_output = gr.Audio(label="Generated Speech")
        
        # Examples
        gr.Examples(
            examples=[
                ["Hello, this is a test of Coqui text-to-speech."],
                ["The quick brown fox jumps over the lazy dog."],
                ["Welcome to the world of artificial intelligence!"]
            ],
            inputs=text_input
        )
        
        generate_btn.click(
            fn=generate_speech,
            inputs=text_input,
            outputs=audio_output
        )
    
    return demo

if __name__ == "__main__":
    print("🚀 Starting Gradio interface...")
    demo = create_interface()
    demo.launch(
        server_name="0.0.0.0", 
        server_port=7860, 
        share=False
    )
