from groq import AsyncGroq
from app.config import settings

class GroqChatProvider:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.model_name = "llama-3.3-70b-versatile"

    async def chat(self, messages: list[dict], context: str) -> str:
        """
        messages expected format: 
        [{"role": "user", "content": "..."}, {"role": "model", "content": "..."}]
        """
        system_instruction = (
            "Eres un asistente médico experto. Se te provee el historial clínico del paciente y los documentos "
            "subidos. Responde a las consultas del médico basándote ÚNICAMENTE en la información provista. "
            "Proporciona tus respuestas en formato Markdown claro y estructurado."
            f"\n\nCONTEXTO CLÍNICO:\n{context}"
        )
        
        # Convert internal format to Groq format (role: assistant instead of model)
        groq_messages = [{"role": "system", "content": system_instruction}]
        
        for msg in messages:
            role = "assistant" if msg["role"] == "model" else "user"
            groq_messages.append({"role": role, "content": msg["content"]})

        response = await self.client.chat.completions.create(
            messages=groq_messages,
            model=self.model_name,
            temperature=0.2,
            max_tokens=2048,
        )
        
        return response.choices[0].message.content

ai_provider = GroqChatProvider()
