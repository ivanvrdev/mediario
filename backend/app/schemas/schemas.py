from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import date, datetime
from uuid import UUID

# Users
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str

class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    phone: Optional[str]
    is_first_login: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    is_first_login: bool = False

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[UUID] = None

# Demo Requests
class DemoRequestCreate(BaseModel):
    last_name: str
    first_name: str
    cuil: str
    email: EmailStr
    phone: str
    specialty: str
    license_number: str

class DemoRequestResponse(BaseModel):
    id: UUID
    last_name: str
    first_name: str
    cuil: str
    email: EmailStr
    phone: str
    specialty: str
    license_number: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DemoRequestUpdate(BaseModel):
    status: str

# Patients
class PatientCreate(BaseModel):
    full_name: str
    dni: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    dni: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class PatientResponse(BaseModel):
    id: UUID
    doctor_id: UUID
    full_name: str
    dni: Optional[str]
    birth_date: Optional[date]
    gender: Optional[str]
    phone: Optional[str]
    notes: Optional[str]
    created_at: datetime
    last_message_date: Optional[datetime] = None

    class Config:
        from_attributes = True

# Medical Files
class MedicalFileResponse(BaseModel):
    id: UUID
    patient_id: UUID
    consultation_id: Optional[UUID]
    original_name: str
    source_type: str
    content_text: str
    uploaded_at: datetime
    chat_log: Optional[List[Any]] = None
    patient_notes: Optional[str] = None

    class Config:
        from_attributes = True

# Consultations
class ConsultationCreate(BaseModel):
    reason: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None

class ConsultationUpdate(BaseModel):
    reason: Optional[str] = None
    observations: Optional[str] = None
    diagnosis: Optional[str] = None
    summary: Optional[str] = None

class ConsultationResponse(BaseModel):
    id: UUID
    patient_id: UUID
    date: datetime
    reason: Optional[str]
    observations: Optional[str]
    diagnosis: Optional[str]
    transcript: Optional[str]
    summary: Optional[str] = None
    chat_log: List[Any]
    created_at: datetime
    files_count: Optional[int] = 0
    transcripts_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Chat
class ChatRequest(BaseModel):
    patient_id: UUID
    message: str
