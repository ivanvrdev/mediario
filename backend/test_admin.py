import asyncio
from app.routers.admin import admin_login, AdminLoginRequest
from app.config import settings

async def test_admin_login():
    req = AdminLoginRequest(email=settings.ADMIN_EMAIL, password=settings.ADMIN_PASSWORD)
    try:
        res = await admin_login(req)
        print("Success:", res)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test_admin_login())
