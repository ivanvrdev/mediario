from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.models import DemoRequest
from app.schemas.schemas import DemoRequestCreate, DemoRequestResponse

router = APIRouter(prefix="/public", tags=["public"])

@router.post("/demo-request", response_model=DemoRequestResponse)
async def create_demo_request(request_in: DemoRequestCreate, db: AsyncSession = Depends(get_db)):
    new_request = DemoRequest(
        last_name=request_in.last_name,
        first_name=request_in.first_name,
        cuil=request_in.cuil,
        email=request_in.email,
        phone=request_in.phone,
        specialty=request_in.specialty,
        license_number=request_in.license_number
    )
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)
    return new_request
