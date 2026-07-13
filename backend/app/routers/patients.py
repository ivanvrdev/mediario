from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import uuid

from sqlalchemy import func
from app.database import get_db
from app.models.models import User, Patient, Consultation
from app.schemas.schemas import PatientCreate, PatientResponse, PatientUpdate
from app.security import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient_in: PatientCreate, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Check DNI uniqueness for this doctor
    if patient_in.dni:
        result = await db.execute(select(Patient).where(Patient.doctor_id == current_user.id, Patient.dni == patient_in.dni))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Ya existe un paciente con este DNI.")

    new_patient = Patient(
        doctor_id=current_user.id,
        full_name=patient_in.full_name,
        dni=patient_in.dni,
        birth_date=patient_in.birth_date,
        gender=patient_in.gender,
        phone=patient_in.phone,
        notes=patient_in.notes
    )
    db.add(new_patient)
    await db.commit()
    await db.refresh(new_patient)
    return new_patient

@router.get("/", response_model=List[PatientResponse])
async def list_patients(
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = (
        select(Patient, func.max(Consultation.created_at).label("last_message_date"))
        .outerjoin(Consultation, Patient.id == Consultation.patient_id)
        .where(Patient.doctor_id == current_user.id)
        .group_by(Patient.id)
    )
    if search:
        query = query.where(
            (Patient.full_name.ilike(f"%{search}%")) | 
            (Patient.dni.ilike(f"%{search}%"))
        )
    
    result = await db.execute(query)
    rows = result.all()
    patients = []
    for p, lmd in rows:
        p.last_message_date = lmd
        patients.append(p)
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: uuid.UUID,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return patient

@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: uuid.UUID,
    patient_in: PatientUpdate,
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Patient).where(Patient.id == patient_id, Patient.doctor_id == current_user.id))
    patient = result.scalars().first()
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    update_data = patient_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(patient, key, value)
    
    await db.commit()
    await db.refresh(patient)
    return patient
