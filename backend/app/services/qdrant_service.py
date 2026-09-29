from app.core.clients import qdrant_client

from qdrant_client.models import PointStruct
from uuid import UUID

COLLECTION_NAME = "devmind_documents"


def create_collection():
    collections = qdrant_client.get_collections()

    exists = any(
        collection.name == COLLECTION_NAME
        for collection in collections.collections
    )

# # 384?
# Eventually we'll convert document text into embeddings:
# "FastAPI is a Python web framework"
#              ↓
#        Embedding Model
#              ↓
# [0.12, -0.45, 0.78, ...]  ← 384 numbers
#              ↓
#            Qdrant
# Then when the user asks:
# "What is FastAPI?"
# we convert the question into another vector and Qdrant finds the most semantically similar document chunks.
# That's the core of RAG.

    if not exists:
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config={
                "size": 384,
                "distance": "Cosine",
            },
        )

    return COLLECTION_NAME


def insert_document(
    vector: list[float],
    text: str,
    point_id: UUID,
    document_id: str,
    chunk_index: int,
):
    qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            PointStruct(
                id=point_id,
                vector=vector,
                payload={
                    "text": text,
                    "document_id": document_id,
                    "chunk_index": chunk_index,
                },
            )
        ],
    )

def search_documents(vector: list[float], limit: int = 3):
    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=limit,
    )

    return results.points


def search_documents(vector: list[float], limit: int = 3):
    results = qdrant_client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=limit,
    )

    return results.points

def insert_document_with_embedding(
    text: str,
    point_id: int,
):
    from app.services.embedding_service import create_embedding

    vector = create_embedding(text)

    insert_document(
        vector=vector,
        text=text,
        point_id=point_id,
    )