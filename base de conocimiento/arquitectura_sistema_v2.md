# Arquitectura del Sistema: Asistente Médico (MVP)
# Versión 3 — optimizado para Free Tiers (Gemini + Groq + Supabase)

---

## 1. Decisiones de diseño para el prototipo (Zero-Cost MVP)

| Decisión | Elección MVP | Justificación |
|----------|-------------|---------------|
| Backend | Python / FastAPI | SDKs nativos para IA, async nativo, muy ligero al delegar ML |
| Frontend | React SPA (Vite) | Alojamiento estático gratuito en Vercel o Netlify |
| Base de datos | PostgreSQL (Supabase) | Capa gratuita generosa, persistente, ideal para startups |
| Almacenamiento de archivos | Ninguno | Los archivos se procesan al subirse; solo se guarda el texto extraído |
| Extracción PDF/JPG | Google Gemini 1.5 Flash API | Multimodalidad nativa. Reemplaza Tesseract/PyMuPDF, 0 consumo RAM local |
| Proveedor de IA (Chat) | Google Gemini 1.5 Flash API | Capa gratuita generosa (15 RPM), contexto amplio |
| Autenticación | JWT (usuario único) | Suficiente para médico independiente, sin servicios externos complejos |
| Transcripción | Groq API (Whisper-large-v3) | Tier gratuito ultra-rápido, evita el colapso de RAM de Whisper local |

---

## 2. Servicios de Despliegue (Free Tiers)

```text
Nube Híbrida (Free Tiers)
├── Vercel / Netlify → Frontend (React SPA)
├── Render / Koyeb   → Backend (FastAPI Web Service)
├── Supabase         → Base de datos (PostgreSQL)
├── Google AI Studio → API para Chat y Extracción de Archivos (Gemini)
└── Groq Cloud       → API para Transcripción de Audio (Whisper)
```

No se requiere Persistent Disk, ni object storage externo, ni instancias con alta RAM/GPU.

---

## 3. Estructura del proyecto

```text
/
├── frontend/             # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Patients.jsx
│   │   │   └── Chat.jsx
│   │   └── components/
│   └── package.json
│
└── backend/              # FastAPI
    ├── app/
    │   ├── main.py
    │   ├── config.py     # variables de entorno (Supabase, Gemini, Groq)
    │   ├── routers/
    │   │   ├── auth.py
    │   │   ├── patients.py
    │   │   ├── consultations.py
    │   │   ├── files.py  # recibe archivo, usa Gemini para extraer, guarda texto
    │   │   └── chat.py
    │   ├── services/
    │   │   ├── ai/
    │   │   │   ├── base.py
    │   │   │   └── gemini.py   # implementación Gemini (Chat)
    │   │   ├── transcription/
    │   │   │   ├── base.py
    │   │   │   └── groq_api.py # implementación Groq Whisper
    │   │   └── processing/
    │   │       └── extractor.py # PDF/JPG → markdown (usando Gemini multimodal)
    │   ├── models/       # modelos SQLAlchemy
    │   └── schemas/      # esquemas Pydantic
    └── requirements.txt
```

---

## 4. Pipeline de procesamiento de archivos (RF03)

```text
Médico sube archivo (PDF o JPG)
        │
        ▼
 Backend recibe archivo en memoria
        │
        ▼
 Enviar archivo a Gemini 1.5 Flash API
 Prompt: "Extrae todo el texto clínico estructurado en Markdown"
        │
        ▼
 Gemini devuelve Markdown estructurado
        │
        ▼
 INSERT en medical_files.content_text
 (archivo original descargado de memoria)
```

Este enfoque elimina dependencias pesadas locales. El backend no necesita procesar la imagen, solo reenviarla.

---

## 5. Capa de abstracción de IA

El sistema está ahora fuertemente inclinado a usar Gemini, pero se mantiene la abstracción para futuras migraciones.

```python
# services/ai/base.py
from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict], context: str) -> str: ...
```

---

## 6. Esquema de base de datos

El schema SQL canónico está definido en `estructura_base_datos_v2.md`. (PostgreSQL compatible, se usará en Supabase).

---

## 7. Variables de entorno (Deploy)

```env
# Base de Datos (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Seguridad Backend
SECRET_KEY=tu_super_secreto_generado
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# APIs Externas
AI_PROVIDER=gemini
GOOGLE_API_KEY=tu_api_key_de_google_ai_studio
GROQ_API_KEY=tu_api_key_de_groq_cloud
```

---

## 8. Flujo del chat (RF11–RF14)

```text
1. Médico selecciona paciente → frontend solicita contexto al backend
2. Backend verifica si existe una consulta activa:
   - Si no existe, la crea automáticamente
3. Backend consulta PostgreSQL (Supabase):
   - N consultas más recientes
   - M estudios más recientes (texto)
4. Backend construye el context string y lo envía a Gemini junto con `chat_log`
5. Gemini responde de forma síncrona
6. Se guarda el intercambio en `consultations.chat_log`
```

### 8.1 Creación de la consulta activa (C02)
La consulta se crea automáticamente al iniciar la sesión de chat.

### 8.2 Límite del context string (C03)
Para evitar exceder el límite de tokens, el context string se arma con una ventana acotada de N consultas y M estudios.

### 8.3 Historial multi-turno de la sesión (C04)
El historial lo mantiene el backend en `chat_log`.

### 8.4 Mecanismo de respuesta (C05)
La respuesta es síncrona para el MVP.

### 8.5 Transcripción activa vs. historial (C06)
El `transcript` de la consulta en curso no se incluye en el contexto activo.

---

## 9. Dependencias principales (requirements.txt)

```text
fastapi
uvicorn[standard]
sqlalchemy
asyncpg
pydantic[email]
python-jose[cryptography]
passlib[bcrypt]
google-genai            # API de Gemini (Chat y Extracción multmodal)
groq                    # API de Groq (Whisper)
python-multipart        # upload de archivos
```

> **Nota Deploy:** Al eliminar `pymupdf` y `pytesseract`, no se requieren binarios a nivel de SO (como `tesseract-ocr`). Esto hace que el despliegue sea un simple `pip install` en cualquier entorno Serverless o PaaS.

---

## 10. Limitaciones del MVP a tener en cuenta

- Los archivos originales no se conservan. Si el médico necesita el PDF original, debe subirlo de nuevo.
- Se depende fuertemente de la disponibilidad y los límites de Rate Limit de la capa gratuita de Google (15 RPM) y Groq.
