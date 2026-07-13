from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import uuid

from app.database import get_db
from app.models.models import User, Patient, MedicalFile, Consultation
from app.schemas.schemas import MedicalFileResponse
from app.security import get_current_user
from app.services.processing.extractor import extractor
from app.services.consultation_service import get_or_create_active_consultation, update_patient_notes

router = APIRouter(prefix="/files", tags=["files"])

@router.post("/", response_model=MedicalFileResponse)
async def upload_file(
    patient_id: uuid.UUID = Form(...),
    consultation_id: uuid.UUID = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify patient ownership
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    if not (file.filename.lower().endswith(".pdf") or file.filename.lower().endswith(".jpg") or file.filename.lower().endswith(".jpeg")):
        raise HTTPException(status_code=400, detail="Formato no soportado. Solo PDF y JPG/JPEG permitidos.")
        
    mime_type = file.content_type
    if not mime_type:
        mime_type = "application/pdf" if file.filename.lower().endswith(".pdf") else "image/jpeg"
        
    source_type = "pdf" if "pdf" in mime_type else "image"
    
    file_bytes = await file.read()
    
    try:
        content_text = await extractor.extract_text(file_bytes, mime_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en extracción: {str(e)}")

    if not consultation_id:
        consultation = await get_or_create_active_consultation(patient, db)
        consultation_id = consultation.id
    else:
        cons_result = await db.execute(select(Consultation).where(Consultation.id == consultation_id))
        consultation = cons_result.scalars().first()
        
    new_file = MedicalFile(
        patient_id=patient_id,
        consultation_id=consultation_id,
        original_name=file.filename,
        source_type=source_type,
        content_text=content_text
    )
    db.add(new_file)
    
    if consultation:
        log = consultation.chat_log.copy() if consultation.chat_log else []
        log.append({
            "role": "user",
            "content": f"**Archivo subido: {file.filename}**\n\n{content_text}"
        })
        log.append({
            "role": "model",
            "content": "He recibido el archivo y he actualizado el resumen general del paciente con esta nueva información."
        })
        consultation.chat_log = log
        db.add(consultation)
        
    await update_patient_notes(patient, content_text, db)
            
    await db.commit()
    await db.refresh(new_file)
    
    if consultation:
        setattr(new_file, 'chat_log', log)
        
    setattr(new_file, 'patient_notes', patient.notes)
    
    return new_file

@router.get("/", response_model=List[MedicalFileResponse])
async def list_files(
    patient_id: uuid.UUID,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify ownership
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == current_user.id))
    if not result.scalars().first():
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
        
    query = select(MedicalFile).where(MedicalFile.patient_id == patient_id).order_by(MedicalFile.uploaded_at.desc())
    result = await db.execute(query)
    return result.scalars().all()
