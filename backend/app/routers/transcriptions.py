from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid

from app.database import get_db
from app.models.models import User, Patient, Consultation, MedicalFile
from app.security import get_current_user
from app.services.transcription.groq_api import transcriber
from app.services.consultation_service import get_or_create_active_consultation, update_patient_notes

router = APIRouter(prefix="/transcriptions", tags=["transcriptions"])

@router.post("/")
async def transcribe_audio(
    patient_id: uuid.UUID = Form(...),
    consultation_id: uuid.UUID = Form(None),
    audio: UploadFile = File(...),
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify patient ownership
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    if not consultation_id:
        consultation = await get_or_create_active_consultation(patient, db)
        consultation_id = consultation.id
    else:
        # Verify consultation belongs to patient
        cons_result = await db.execute(select(Consultation).where(Consultation.id == consultation_id, Consultation.patient_id == patient_id))
        consultation = cons_result.scalars().first()
        if not consultation:
            raise HTTPException(status_code=404, detail="Consulta no encontrada")
        
    audio_bytes = await audio.read()
    
    try:
        transcript_text = await transcriber.transcribe(audio_bytes, audio.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en transcripción: {str(e)}")
        
    # Append to existing transcript or create new
    if consultation.transcript:
        consultation.transcript += f"\n\n{transcript_text}"
    else:
        consultation.transcript = transcript_text
        
    # Also save as an attached MedicalFile for unified visibility and AI context
    from datetime import datetime
    file_name = f"Nota_de_Voz_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.txt"
    new_file = MedicalFile(
        patient_id=patient_id,
        consultation_id=consultation_id,
        original_name=file_name,
        source_type='audio',
        content_text=transcript_text
    )
    db.add(new_file)
        
    # Append to chat_log
    log = consultation.chat_log.copy() if consultation.chat_log else []
    log.append({
        "role": "user",
        "content": f"**Transcripción de audio:**\n\n{transcript_text}"
    })
    log.append({
        "role": "model",
        "content": "He procesado el audio y he actualizado el resumen general del paciente con la nueva información médica."
    })
    consultation.chat_log = log
        
    db.add(consultation)
    
    # Update notes
    await update_patient_notes(patient, transcript_text, db)
    
    await db.commit()
    
    return {"transcript": transcript_text, "consultation_id": str(consultation.id), "chat_log": log, "patient_notes": patient.notes}
