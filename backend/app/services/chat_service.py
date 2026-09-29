import hashlib

from app.core.clients import redis_client
from app.services.rag_service import retrieve_context
from app.services.ai_service import generate_ai_response


async def generate_response(message: str):
    cache_key = f"chat:{hashlib.sha256(message.encode()).hexdigest()}"

    cached_response = None
    try:
        cached_response = redis_client.get(cache_key)
    except Exception:
        cached_response = None

    if cached_response:
        return {
            "response": cached_response,
            "sources": [],
            "cached": True,
        }

    context = retrieve_context(message)

    try:
        response = await generate_ai_response(
            message,
            context,
        )
    except Exception as e:
        response = f"Backend AI Response (Scaffolding): Received query '{message}'. Note: Real LLM streaming connects in Phase 11 & 14. Error details: {str(e)}"

    try:
        redis_client.setex(
            cache_key,
            60,
            response,
        )
    except Exception:
        pass

    sources = [
        {
            "document_id": item["document_id"],
            "chunk_index": item["chunk_index"],
            "score": item["score"],
            "text": item.get("text"),
        }
        for item in context
    ]

    return {
        "response": response,
        "sources": sources,
        "cached": False,
    }