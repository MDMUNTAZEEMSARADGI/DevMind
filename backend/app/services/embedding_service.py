"""
Embedding Service (Scaffolding):
In Phase 2, this provides lazy loading and defensive fallback so that
module imports do not crash when native PyTorch DLLs are restricted or uninitialized.
Deep dive and real embedding models are implemented in Phase 7.
"""
import hashlib

_model = None


def get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except (ImportError, OSError):
            _model = False
    return _model


def create_embedding(text: str) -> list[float]:
    model = get_embedding_model()
    if model:
        try:
            vector = model.encode(text)
            return vector.tolist()
        except Exception:
            pass

    # Scaffolding fallback: Deterministic 384-dimensional vector based on SHA-256 hash
    # Real embeddings are implemented in Phase 7
    raw_hash = hashlib.sha256(text.encode("utf-8")).digest()
    expanded = (raw_hash * 12)[:384]
    return [(b / 255.0 - 0.5) for b in expanded]