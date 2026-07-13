import tempfile
import os
from groq import Groq
from app.config import settings

class GroqTranscriber:
    def __init__(self):
        # We use sync Groq client in an async wrapper or directly the async Groq client
        from groq import AsyncGroq
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model_name = "whisper-large-v3"

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.wav") -> str:
        # Groq SDK requires a file-like object or tuple, but for simplicity and reliability with the SDK, 
        # we can write it to a temp file and open it.
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            tmp_file.write(audio_bytes)
            tmp_path = tmp_file.name

        try:
            with open(tmp_path, "rb") as file_obj:
                transcription = await self.client.audio.transcriptions.create(
                    file=(filename, file_obj.read()),
                    model=self.model_name,
                    language="es",
                    response_format="text"
                )
            return transcription
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

transcriber = GroqTranscriber()
