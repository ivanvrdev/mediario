# Tareas de Desarrollo — MVP Asistente Médico
# Versión 4 — Stack Zero-Cost: Gemini (Chat+OCR) + Groq (Whisper) + Supabase + Vercel + Render

Fuentes: `relevamiento_inicial_v4.md`, `arquitectura_sistema_v2.md` (v3), `estructura_base_datos_v2.md`, mockups.

---

## Fase 1: Setup e infraestructura

- [ ] Inicializar repositorio con estructura monorepo (`/frontend`, `/backend`)
- [ ] Configurar base de datos PostgreSQL remota en **Supabase** (Free Tier)
- [ ] Definir variables de entorno: `DATABASE_URL`, `SECRET_KEY`, `AI_PROVIDER` (default `gemini`), `GOOGLE_API_KEY`, `GROQ_API_KEY`
- [ ] Crear `requirements.txt` optimizado (sin pymupdf ni tesseract)
- [ ] Inicializar proyecto React con Vite (`npm create vite`) e integrar Tailwind CSS
- [ ] Ejecutar migraciones SQL en Supabase para crear tablas: `users`, `patients`, `consultations`, `medical_files`

---

## Fase 2: Autenticación (RF09, RF15)

**Backend**
- [ ] `POST /auth/register` — crear médico
- [ ] `POST /auth/login` — validar credenciales, devolver JWT
- [ ] Middleware de autenticación JWT (validar `doctor_id`)

**Frontend**
- [ ] Pantallas Login y Registro (`Login.jsx`, `Register.jsx`)
- [ ] Guardar JWT y adjuntarlo en headers

---

## Fase 3: Gestión de pacientes (RF01, RF08, RF10)

**Backend**
- [ ] `POST /patients` (crear)
- [ ] `GET /patients` (listar con filtro)
- [ ] `GET /patients/{id}` (detalle)
- [ ] `PUT /patients/{id}` (editar)

**Frontend**
- [ ] Sidebar con lista y búsqueda en tiempo real
- [ ] Formulario de nuevo paciente
- [ ] Selección para activar chat (RF10)

---

## Fase 4: Procesamiento de archivos (RF03, RF04)

**Backend**
- [ ] Implementar `services/processing/extractor.py` — usar `google-genai` (Gemini 1.5 Flash) para extraer texto de PDFs e imágenes. Eliminar Tesseract/PyMuPDF.
- [ ] `POST /files` — recibir archivo, enviarlo a Gemini con prompt estructurado, guardar `content_text` devuelto en BD, descartar archivo original.

**Frontend**
- [ ] UI para subir archivo (.pdf, .jpg)
- [ ] Mostrar estado de carga y renderizar markdown
- [ ] Vista "Detalle de Archivos del Paciente"

---

## Fase 5: Gestión de consultas (RF02, RF07, RF14)

**Backend**
- [ ] `POST /consultations` (crear manual)
- [ ] `GET /consultations?patient_id=` (listar)
- [ ] `GET /consultations/{id}` (detalle)
- [ ] `PATCH /consultations/{id}` (actualizar)

**Frontend**
- [ ] Historial de consultas y edición

---

## Fase 6: Chat e integración con IA (RF05, RF11, RF12, RF13)

**Backend**
- [ ] `services/ai/gemini.py` — Integración Chat con Google Gemini.
- [ ] `POST /chat` — Crear consulta automática si no existe, cargar contexto (N consultas, M estudios), invocar Gemini síncronamente, guardar log incremental.

**Frontend**
- [ ] Interfaz de Chat (`Chat.jsx`) con burbujas y estado de espera.
- [ ] Carga inicial de contexto y resumen (RF11).

---

## Fase 7: Transcripción de audio (RF06)

**Backend**
- [ ] Implementar `services/transcription/groq_api.py` — Integración con API de Groq (`whisper-large-v3`).
- [ ] `POST /transcriptions` — recibir audio, enviar a Groq, guardar transcripción devuelta.

**Frontend**
- [ ] Captura de audio en navegador (Web Audio API)
- [ ] Botón grabar/detener, enviar al backend y mostrar texto.

---

## Fase 8 & 9: Seguridad y Despliegue

- [ ] Aislamiento de datos (`doctor_id` check en todo endpoint)
- [ ] Desplegar Frontend en Vercel
- [ ] Desplegar Backend en Render (Web Service Free) o Koyeb
- [ ] Tests E2E de los flujos completos
