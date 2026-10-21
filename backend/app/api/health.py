from fastapi import APIRouter
from sqlalchemy import text

from app.core.clients import redis_client, qdrant_client
from app.db.session import AsyncSessionLocal

router = APIRouter()


@router.get("/health")
async def health():
    # Check PostgreSQL connectivity gracefully
    postgres_ok = False
    try:
        async with AsyncSessionLocal() as session:
            res = await session.execute(text("SELECT 1"))
            postgres_ok = (res.scalar() == 1)
    except Exception:
        postgres_ok = False

    # Check Redis connectivity gracefully
    redis_ok = False
    try:
        redis_ok = bool(redis_client.ping())
    except Exception:
        redis_ok = False

    # Check Qdrant connectivity gracefully
    qdrant_ok = False
    collection_count = 0
    try:
        collections = qdrant_client.get_collections()
        qdrant_ok = True
        collection_count = len(collections.collections)
    except Exception:
        qdrant_ok = False

    return {
        "status": "healthy",
        "backend": True,
        "postgres": postgres_ok,
        "redis": redis_ok,
        "qdrant": qdrant_ok,
        "qdrant_collections": collection_count,
    }
