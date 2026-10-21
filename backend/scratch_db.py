import asyncio
import traceback
from sqlalchemy import text
from app.db.session import AsyncSessionLocal

async def f():
    try:
        async with AsyncSessionLocal() as s:
            r = await s.execute(text("SELECT 1"))
            print("SUCCESS:", r.scalar())
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(f())
