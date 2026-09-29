import hashlib

from app.core.clients import redis_client
from app.services.rag_service import retrieve_context
from app.services.ai_service import generate_ai_response


async def generate_response(message: str):

    cache_key = (
        f"chat:{hashlib.sha256(message.encode()).hexdigest()}"
    )

    cached_response = redis_client.get(cache_key)

    if cached_response:
        return {
            "response": cached_response,
            "sources": [],
            "cached": True,
        }

    context = retrieve_context(message)

    response = await generate_ai_response(
        message,
        context,
    )

    redis_client.setex(
        cache_key,
        60,
        response,
    )

    sources = [
        {
            "document_id": item["document_id"],
            "chunk_index": item["chunk_index"],
            "score": item["score"],
        }
        for item in context
    ]

    return {
        "response": response,
        "sources": sources,
        "cached": False,
    }