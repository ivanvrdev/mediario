from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid
from datetime import datetime

from app.database import get_db
from app.models.models import User, Patient, Consultation, MedicalFile
from app.schemas.schemas import ChatRequest
from app.security import get_current_user
from app.services.ai.groq_chat import ai_provider

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/")
async def chat_interaction(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify ownership
    result = await db.execute(select(Patient).where(Patient.id == request.patient_id, Patient.doctor_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    # Get active consultation or create one
    from app.services.consultation_service import get_or_create_active_consultation
    active_consultation = await get_or_create_active_consultation(patient, db)

    # Build context: N recent consultations (excluding current if empty) + M recent files
    N = 5
    M = 5
    
    # Fetch previous consultations
    cons_result = await db.execute(
        select(Consultation)
        .where(Consultation.patient_id == patient.id, Consultation.id != active_consultation.id)
        .order_by(Consultation.date.desc())
        .limit(N)
    )
    previous_consultations = cons_result.scalars().all()
    
    # Fetch recent files
    files_result = await db.execute(
        select(MedicalFile)
        .where(MedicalFile.patient_id == patient.id)
        .order_by(MedicalFile.uploaded_at.desc())
        .limit(M)
    )
    recent_files = files_result.scalars().all()
    
    context_str = f"Paciente: {patient.full_name}\n"
    if patient.notes:
        context_str += f"Notas: {patient.notes}\n\n"
        
    context_str += "--- ARCHIVOS CLÍNICOS RECIENTES ---\n"
    for f in recent_files:
        context_str += f"Archivo: {f.original_name} (Fecha: {f.uploaded_at})\nContenido:\n{f.content_text}\n\n"
        
    context_str += "--- HISTORIAL DE CONSULTAS PREVIAS ---\n"
    for c in previous_consultations:
        context_str += f"Fecha: {c.date}\nMotivo: {c.reason}\nObs: {c.observations}\nDiag: {c.diagnosis}\n"
        if c.summary:
            context_str += f"Resumen IA: {c.summary}\n"
        if c.transcript:
            context_str += f"Transcripción de audio: {c.transcript}\n"
        context_str += "\n"

    # Append new user message to chat log
    messages = active_consultation.chat_log.copy() if active_consultation.chat_log else []
    messages.append({"role": "user", "content": request.message})
    
    # Call Gemini
    try:
        bot_response = await ai_provider.chat(messages, context_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al comunicarse con IA: {str(e)}")
        
    # Append bot response
    messages.append({"role": "model", "content": bot_response})
    
    # Save back to active consultation
    active_consultation.chat_log = messages
    db.add(active_consultation) # mark as dirty
    await db.commit()
    
    return {"reply": bot_response, "chat_log": messages}
