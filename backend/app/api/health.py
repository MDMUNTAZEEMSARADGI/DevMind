from fastapi import APIRouter

from app.core.clients import redis_client, qdrant_client

router = APIRouter()


@router.get("/health")
async def health():
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
        "redis": redis_ok,
        "qdrant": qdrant_ok,
        "qdrant_collections": collection_count,
    }
