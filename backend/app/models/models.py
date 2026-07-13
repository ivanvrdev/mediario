from sqlalchemy import Column, String, Text, Date, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(200), nullable=False)
    email = Column(String(254), unique=True, nullable=False, index=True)
    phone = Column(String(50))
    password_hash = Column(Text, nullable=False)
    is_first_login = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patients = relationship("Patient", back_populates="doctor", cascade="all, delete-orphan")

class DemoRequest(Base):
    __tablename__ = "demo_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    last_name = Column(String(200), nullable=False)
    first_name = Column(String(200), nullable=False)
    cuil = Column(String(50), nullable=False)
    email = Column(String(254), nullable=False)
    phone = Column(String(50), nullable=False)
    specialty = Column(String(200), nullable=False)
    license_number = Column(String(100), nullable=False)
    status = Column(String(50), default="pending") # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(200), nullable=False)
    dni = Column(String(20))
    birth_date = Column(Date)
    gender = Column(String(50))
    phone = Column(String(50))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("User", back_populates="patients")
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
    medical_files = relationship("MedicalFile", back_populates="patient", cascade="all, delete-orphan")

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    reason = Column(Text)
    observations = Column(Text)
    diagnosis = Column(Text)
    transcript = Column(Text)
    summary = Column(Text)
    chat_log = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="consultations")
    medical_files = relationship("MedicalFile", back_populates="consultation")

class MedicalFile(Base):
    __tablename__ = "medical_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    consultation_id = Column(UUID(as_uuid=True), ForeignKey("consultations.id", ondelete="SET NULL"), nullable=True)
    original_name = Column(String(300), nullable=False)
    source_type = Column(String(20), nullable=False) # 'pdf' or 'image'
    content_text = Column(Text, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="medical_files")
    consultation = relationship("Consultation", back_populates="medical_files")
