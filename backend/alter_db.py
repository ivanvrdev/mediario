import asyncio
from sqlalchemy import text
from app.database import engine

async def alter_table():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN is_first_login BOOLEAN DEFAULT TRUE;"))
            print("Column added successfully.")
        except Exception as e:
            print(f"Error (maybe column exists?): {e}")

if __name__ == "__main__":
    asyncio.run(alter_table())
