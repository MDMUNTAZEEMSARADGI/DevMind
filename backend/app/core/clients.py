import redis
from qdrant_client import QdrantClient

from app.core.config import settings

# Redis client configured with fast connection timeouts (500ms)
# so disconnected services fail fast instead of blocking HTTP workers
redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    socket_connect_timeout=0.5,
    socket_timeout=0.5,
)

# Qdrant client configured with fast connection timeout
qdrant_client = QdrantClient(
    url=settings.QDRANT_URL,
    timeout=0.5,
    check_compatibility=False,
)