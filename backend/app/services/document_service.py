from pathlib import Path
from uuid import uuid4

from pypdf import PdfReader
from docx import Document

from app.services.chunking_service import chunk_text
from app.services.embedding_service import create_embedding
from app.services.qdrant_service import insert_document


def extract_text(file_path: str) -> str:

    path = Path(file_path)

    extension = path.suffix.lower()

    if extension == ".txt":

        return path.read_text(
            encoding="utf-8"
        )

    if extension == ".pdf":

        reader = PdfReader(file_path)

        pages = []

        for page in reader.pages:

            text = page.extract_text()

            if text:
                pages.append(text)

        return "\n\n".join(pages)

    if extension == ".docx":

        document = Document(file_path)

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        ]

        return "\n\n".join(paragraphs)

    raise ValueError(
        f"Unsupported file type: {extension}"
    )


def ingest_document(file_path: str) -> dict:
    path = Path(file_path)
    document_id = path.stem
    text = extract_text(file_path)

    if not text.strip():
        raise ValueError(
            "Document contains no readable text"
        )

    chunks = chunk_text(text)
    indexed_count = 0
    qdrant_error = None

    for index, chunk in enumerate(chunks):
        try:
            vector = create_embedding(chunk)
            insert_document(
                vector=vector,
                text=chunk,
                point_id=uuid4(),
                document_id=document_id,
                chunk_index=index,
            )
            indexed_count += 1
        except Exception as error:
            qdrant_error = str(error)
            break

    return {
        "chunks": len(chunks),
        "indexed": indexed_count == len(chunks) and len(chunks) > 0,
        "indexed_count": indexed_count,
        "status": "indexed" if indexed_count == len(chunks) else "uploaded",
        "error": qdrant_error,
    }