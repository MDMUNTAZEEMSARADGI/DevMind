from fastapi import APIRouter

from app.core.clients import redis_client, qdrant_client

router = APIRouter()


@router.get("/health")
async def health():
    redis_ok = redis_client.ping()
    qdrant_ok = qdrant_client.get_collections()

    return {
        "status": "healthy",
        "redis": redis_ok,
        "qdrant": True,
        "qdrant_collections": len(qdrant_ok.collections),
    }
