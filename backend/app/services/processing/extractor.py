import base64
import io
from pypdf import PdfReader
from groq import AsyncGroq
from app.config import settings

class HybridExtractor:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.vision_model = "meta-llama/llama-4-scout-17b-16e-instruct"

    async def extract_text(self, file_bytes: bytes, mime_type: str) -> str:
        """
        Extracts structured text from a PDF (using pypdf natively) 
        or an image (using Groq Vision).
        """
        
        # 1. Handle PDFs natively (Lightweight text extraction)
        if "pdf" in mime_type.lower():
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                text_content = ""
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        text_content += text + "\n"
                
                if not text_content.strip():
                    return "El PDF parece ser una imagen escaneada sin texto seleccionable. Por favor, súbelo en formato JPG para usar OCR."
                
                return text_content
            except Exception as e:
                raise ValueError(f"No se pudo leer el archivo PDF: {str(e)}")

        # 2. Handle Images using Groq Vision (OCR)
        elif "image" in mime_type.lower():
            base64_image = base64.b64encode(file_bytes).decode('utf-8')
            
            prompt = (
                "Extrae todo el texto clínico, tablas, resultados y observaciones de este documento médico. "
                "Formatea la salida estrictamente en Markdown estructurado, sin agregar saludos ni explicaciones extra. "
                "Asegúrate de preservar la precisión de los valores numéricos."
            )
            
            response = await self.client.chat.completions.create(
                model=self.vision_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{mime_type};base64,{base64_image}",
                                }
                            }
                        ]
                    }
                ],
                temperature=0.0,
                max_tokens=2048
            )
            return response.choices[0].message.content
            
        else:
            raise ValueError(f"Formato no soportado: {mime_type}")

extractor = HybridExtractor()
