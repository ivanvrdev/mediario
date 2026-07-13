from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
import string
import secrets
from typing import List, Optional

from app.database import get_db
from app.models.models import User, DemoRequest, Patient, MedicalFile
from app.schemas.schemas import DemoRequestResponse, Token
from app.security import get_password_hash, create_access_token
from app.config import settings

router = APIRouter(prefix="/admin", tags=["admin"])

class AdminLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=Token)
async def admin_login(request: AdminLoginRequest):
    if request.email == settings.ADMIN_EMAIL and request.password == settings.ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": "admin_user", "role": "admin"})
        return {"access_token": access_token, "token_type": "bearer", "is_first_login": False}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales de administrador incorrectas",
    )

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales de admin",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        role: str = payload.get("role")
        if role != "admin":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return True

@router.get("/demo-requests", response_model=List[DemoRequestResponse])
async def get_demo_requests(db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    result = await db.execute(select(DemoRequest).order_by(DemoRequest.created_at.desc()))
    return result.scalars().all()

class AcceptResponse(BaseModel):
    message: str
    generated_password: str

class UserCreateRequest(BaseModel):
    first_name: str
    last_name: str
    cuil: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    specialty: Optional[str] = ""
    license_number: Optional[str] = ""
    password: str

class UserEditRequest(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = ""
    password: Optional[str] = None
    is_first_login: bool

@router.post("/users", response_model=AcceptResponse)
async def create_user(request: UserCreateRequest, db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    # Check if user email already exists
    user_check = await db.execute(select(User).where(User.email == request.email))
    if user_check.scalars().first():
         raise HTTPException(status_code=400, detail="El correo ya pertenece a un usuario existente.")
    
    # Create User
    new_user = User(
        full_name=f"{request.first_name} {request.last_name}",
        email=request.email,
        phone=request.phone,
        password_hash=get_password_hash(request.password),
        is_first_login=True
    )
    db.add(new_user)
    
    # Create DemoRequest with accepted status to keep record of the extra fields
    demo_req = DemoRequest(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        phone=request.phone,
        cuil=request.cuil,
        specialty=request.specialty,
        license_number=request.license_number,
        status="accepted"
    )
    db.add(demo_req)

    await db.commit()
    
    return {"message": "Usuario creado exitosamente.", "generated_password": request.password}

@router.put("/demo-requests/{request_id}/accept", response_model=AcceptResponse)
async def accept_demo_request(request_id: str, db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    result = await db.execute(select(DemoRequest).where(DemoRequest.id == request_id))
    demo_req = result.scalars().first()
    if not demo_req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    if demo_req.status != "pending":
        raise HTTPException(status_code=400, detail="La solicitud ya fue procesada")

    # Generate a random 8-character password
    alphabet = string.ascii_letters + string.digits
    generated_password = ''.join(secrets.choice(alphabet) for i in range(8))
    
    # Check if user email already exists
    user_check = await db.execute(select(User).where(User.email == demo_req.email))
    if user_check.scalars().first():
         raise HTTPException(status_code=400, detail="El correo de la solicitud ya pertenece a un usuario existente.")
    
    # Create User
    new_user = User(
        full_name=f"{demo_req.first_name} {demo_req.last_name}",
        email=demo_req.email,
        phone=demo_req.phone,
        password_hash=get_password_hash(generated_password),
        is_first_login=True
    )
    db.add(new_user)
    
    # Update request status
    demo_req.status = "accepted"
    db.add(demo_req)
    
    await db.commit()
    
    return {"message": "Solicitud aceptada y usuario creado.", "generated_password": generated_password}

@router.put("/demo-requests/{request_id}/reject")
async def reject_demo_request(request_id: str, db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    result = await db.execute(select(DemoRequest).where(DemoRequest.id == request_id))
    demo_req = result.scalars().first()
    if not demo_req:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")
    
    demo_req.status = "rejected"
    db.add(demo_req)
    await db.commit()
    
    return {"message": "Solicitud rechazada"}

@router.get("/users")
async def get_users_stats(db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    
    stats_list = []
    for user in users:
        # Get patient count
        p_res = await db.execute(select(func.count(Patient.id)).where(Patient.doctor_id == user.id))
        patient_count = p_res.scalar() or 0
        
        # Get files stats
        f_res = await db.execute(select(MedicalFile.source_type).join(Patient).where(Patient.doctor_id == user.id))
        files = f_res.scalars().all()
        
        images_count = sum(1 for f in files if f == 'image')
        audios_count = sum(1 for f in files if f == 'audio')
        pdfs_count = sum(1 for f in files if f == 'pdf')
        total_files = len(files)
        
        stats_list.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "created_at": user.created_at,
            "patients_count": patient_count,
            "files_count": total_files,
            "images_count": images_count,
            "audios_count": audios_count,
            "pdfs_count": pdfs_count,
            "is_first_login": user.is_first_login
        })
        
    return stats_list

@router.put("/users/{user_id}")
async def edit_user(user_id: str, request: UserEditRequest, db: AsyncSession = Depends(get_db), is_admin: bool = Depends(get_current_admin)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    # Check if new email is used by another user
    if request.email != user.email:
        email_check = await db.execute(select(User).where(User.email == request.email))
        if email_check.scalars().first():
            raise HTTPException(status_code=400, detail="El correo ya pertenece a otro usuario")

    user.full_name = request.full_name
    user.email = request.email
    user.phone = request.phone
    user.is_first_login = request.is_first_login
    if request.password:
        user.password_hash = get_password_hash(request.password)
    
    await db.commit()
    return {"message": "Usuario actualizado exitosamente"}
