from app.services.embedding_service import create_embedding
from app.services.qdrant_service import search_documents


def retrieve_context(question: str) -> list[dict]:

    vector = create_embedding(question)

    results = search_documents(
        vector,
        limit=3,
    )

    context = []

    for result in results:

        if not result.payload:
            continue

        text = result.payload.get("text")

        if not text:
            continue

        context.append(
            {
                "text": text,
                "document_id": result.payload.get("document_id"),
                "chunk_index": result.payload.get("chunk_index"),
                "score": result.score,
            }
        )

    return context