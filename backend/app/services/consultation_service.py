import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.models import Consultation, Patient
from app.services.ai.groq_chat import ai_provider

async def get_or_create_active_consultation(patient: Patient, db: AsyncSession) -> Consultation:
    result = await db.execute(
        select(Consultation)
        .where(Consultation.patient_id == patient.id)
        .order_by(Consultation.date.desc())
        .limit(1)
    )
    active_consultation = result.scalars().first()
    
    now = datetime.utcnow()
    if active_consultation:
        hours_passed = (now - active_consultation.date).total_seconds() / 3600
        if hours_passed > 24:
            # Generate summary for old consultation
            if active_consultation.chat_log and not active_consultation.summary:
                try:
                    summary_prompt = "Genera un breve resumen estructurado (diagnóstico principal si lo hay, y próximos pasos) de la siguiente sesión médica."
                    summary_context = f"Paciente: {patient.full_name}\n"
                    summary_response = await ai_provider.chat(active_consultation.chat_log, summary_context + summary_prompt)
                    active_consultation.summary = summary_response
                    db.add(active_consultation)
                    await db.commit()
                except Exception as e:
                    print(f"Error generando resumen de la sesión: {e}")
            active_consultation = None # Force creation of new one

    if not active_consultation:
        active_consultation = Consultation(
            patient_id=patient.id,
            date=now,
            chat_log=[]
        )
        db.add(active_consultation)
        await db.commit()
        await db.refresh(active_consultation)

    return active_consultation


async def update_patient_notes(patient: Patient, new_content: str, db: AsyncSession):
    try:
        prompt = (
            "Actualiza el siguiente resumen general del cuadro clínico del paciente incorporando "
            "de forma inteligente la nueva información extraída. Conserva el contexto médico importante "
            "anterior y redacta el nuevo resumen general de forma concisa y profesional.\n\n"
            f"Paciente: {patient.full_name}\n"
            "Resumen actual:\n"
            f"{patient.notes or 'Sin notas previas.'}\n\n"
            "Nueva información a incorporar:\n"
            f"{new_content}\n\n"
            "Devuelve únicamente el nuevo texto actualizado del resumen del paciente."
        )
        
        response = await ai_provider.chat(
            [{"role": "user", "content": prompt}], 
            "Eres un asistente médico experto. Devuelve únicamente el texto solicitado, sin saludos, explicaciones ni formato markdown de bloque de código."
        )
        
        patient.notes = response.strip()
        db.add(patient)
        await db.commit()
    except Exception as e:
        print(f"Error actualizando notas generales del paciente: {e}")
