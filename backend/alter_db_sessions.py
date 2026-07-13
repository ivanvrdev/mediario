import asyncio
from sqlalchemy import text
from app.database import engine

async def alter_table():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE consultations ADD COLUMN summary TEXT;"))
            print("Column summary added successfully.")
        except Exception as e:
            print(f"Error (maybe column exists?): {e}")

if __name__ == "__main__":
    asyncio.run(alter_table())
