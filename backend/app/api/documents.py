from pathlib import Path
import uuid
from typing import List

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user_entity
from app.db.session import get_db
from app.models.document import Document
from app.models.user import User
from app.services.document_service import ingest_document

router = APIRouter(prefix="/documents")

ALLOWED_EXTENSIONS = {
    ".txt",
    ".pdf",
    ".docx",
}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Allowed: .txt, .pdf, .docx",
        )

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / (file.filename or f"doc_{uuid.uuid4()}{extension}")

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    try:
        result = ingest_document(str(file_path))
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    file_size = file_path.stat().st_size

    # Persist document metadata in PostgreSQL
    db_doc = Document(
        user_id=current_user.id,
        filename=file.filename or file_path.name,
        file_path=str(file_path),
        file_size=file_size,
        mime_type=file.content_type or "text/plain",
        status=result.get("status", "indexed"),
        chunks_count=result.get("chunks", 0),
    )
    db.add(db_doc)
    await db.flush()
    await db.refresh(db_doc)

    return {
        "message": "Document uploaded successfully",
        "id": str(db_doc.id),
        "filename": db_doc.filename,
        "file_size": db_doc.file_size,
        "status": db_doc.status,
        "chunks_count": db_doc.chunks_count,
        "uploaded_at": db_doc.created_at.timestamp(),
    }


@router.get("")
async def list_documents(
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    # Query persisted documents for the authenticated user
    stmt = (
        select(Document)
        .where(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
    )
    result = await db.execute(stmt)
    documents = result.scalars().all()

    # Backfill pre-existing disk files from Phase 1/2 if database has no records yet
    if not documents:
        upload_dir = Path("uploads")
        if upload_dir.exists():
            for file_path in upload_dir.iterdir():
                if file_path.is_file() and not file_path.name.startswith("."):
                    stat = file_path.stat()
                    backfill_doc = Document(
                        user_id=current_user.id,
                        filename=file_path.name,
                        file_path=str(file_path),
                        file_size=stat.st_size,
                        mime_type="text/plain",
                        status="indexed",
                        chunks_count=0,
                    )
                    db.add(backfill_doc)
            await db.flush()
            # Re-fetch after backfill
            result = await db.execute(stmt)
            documents = result.scalars().all()

    return [
        {
            "id": str(doc.id),
            "filename": doc.filename,
            "file_size": doc.file_size,
            "status": doc.status,
            "chunks_count": doc.chunks_count,
            "uploaded_at": doc.created_at.timestamp(),
        }
        for doc in documents
    ]


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    try:
        doc_uuid = uuid.UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID format")

    stmt = select(Document).where(
        Document.id == doc_uuid,
        Document.user_id == current_user.id,
    )
    result = await db.execute(stmt)
    doc = result.scalar_one_or_none()

    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Remove physical file if present
    file_path = Path(doc.file_path)
    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            pass

    await db.delete(doc)
    return {"message": "Document deleted successfully", "id": document_id}