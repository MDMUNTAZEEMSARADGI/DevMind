import redis
from qdrant_client import QdrantClient

from app.core.config import settings


redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
)

qdrant_client = QdrantClient(
    url=settings.QDRANT_URL,
)