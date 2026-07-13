from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, patients, consultations, files, chat, transcriptions, admin, public
from app.database import engine, Base
import logging

logging.basicConfig(level=logging.INFO)

# Instancia de FastAPI
app = FastAPI(title="Asistente Médico API", version="3.0.0")

# CORS middleware para React local (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción reemplazar con ["http://localhost:5173", "https://misitio.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar Base de Datos (en producción se debería usar Alembic)
@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Registrar Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(consultations.router)
app.include_router(files.router)
app.include_router(chat.router)
app.include_router(transcriptions.router)
app.include_router(admin.router)
app.include_router(public.router)

@app.get("/")
def read_root():
    return {"message": "API del Asistente Médico funcionando correctamente"}
