from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "supersecretkey_for_development_only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    AI_PROVIDER: str = "groq"
    GROQ_API_KEY: str

    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "adminpassword123"

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
