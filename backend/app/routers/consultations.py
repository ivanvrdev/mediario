from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.database import get_db
from app.models.models import User, Patient, Consultation
from app.schemas.schemas import ConsultationCreate, ConsultationResponse, ConsultationUpdate
from app.security import get_current_user

router = APIRouter(prefix="/consultations", tags=["consultations"])

async def get_patient_or_404(db: AsyncSession, patient_id: uuid.UUID, doctor_id: uuid.UUID) -> Patient:
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == doctor_id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patient

@router.post("/", response_model=ConsultationResponse)
async def create_consultation(
    patient_id: uuid.UUID = Query(...),
    consultation_in: ConsultationCreate = ConsultationCreate(), 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    await get_patient_or_404(db, patient_id, current_user.id)
    
    new_consultation = Consultation(
        patient_id=patient_id,
        reason=consultation_in.reason,
        observations=consultation_in.observations,
        diagnosis=consultation_in.diagnosis,
        chat_log=[]
    )
    db.add(new_consultation)
    await db.commit()
    await db.refresh(new_consultation)
    return new_consultation

@router.get("/", response_model=List[ConsultationResponse])
async def list_consultations(
    patient_id: uuid.UUID = Query(...),
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    await get_patient_or_404(db, patient_id, current_user.id)
    
    result = await db.execute(
        select(Consultation)
        .options(selectinload(Consultation.medical_files))
        .where(Consultation.patient_id == patient_id)
        .order_by(Consultation.date.desc())
    )
    consultations = result.scalars().all()
    
    # Calculate counts
    for c in consultations:
        c.files_count = sum(1 for f in c.medical_files if f.source_type != 'audio')
        c.transcripts_count = sum(1 for f in c.medical_files if f.source_type == 'audio')
        
    return consultations

@router.get("/{consultation_id}", response_model=ConsultationResponse)
async def get_consultation(
    consultation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify doctor owns the patient of this consultation
    query = select(Consultation).join(Patient).where(
        Consultation.id == consultation_id, 
        Patient.doctor_id == current_user.id
    )
    result = await db.execute(query)
    consultation = result.scalars().first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    return consultation

@router.patch("/{consultation_id}", response_model=ConsultationResponse)
async def update_consultation(
    consultation_id: uuid.UUID,
    consultation_in: ConsultationUpdate,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = select(Consultation).join(Patient).where(
        Consultation.id == consultation_id, 
        Patient.doctor_id == current_user.id
    )
    result = await db.execute(query)
    consultation = result.scalars().first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consulta no encontrada")
    
    update_data = consultation_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(consultation, key, value)
    
    await db.commit()
    await db.refresh(consultation)
    return consultation
