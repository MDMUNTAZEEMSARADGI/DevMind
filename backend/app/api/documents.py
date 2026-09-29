from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

from app.api.dependencies import get_current_user

from app.services.document_service import ingest_document


router = APIRouter(
    prefix="/documents"
)


ALLOWED_EXTENSIONS = {
    ".txt",
    ".pdf",
    ".docx",
}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed: .txt, .pdf, .docx"
            ),
        )

    upload_dir = Path("uploads")

    upload_dir.mkdir(
        exist_ok=True
    )

    file_path = upload_dir / (
        file.filename
    )

    with open(file_path, "wb") as buffer:

        buffer.write(
            await file.read()
        )

    try:
        result = ingest_document(str(file_path))

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    file_size = file_path.stat().st_size

    return {
        "message": "Document uploaded successfully",
        "id": file_path.stem,
        "filename": file.filename,
        "file_size": file_size,
        "status": result["status"],
        "chunks_count": result["chunks"],
        "uploaded_at": file_path.stat().st_mtime,
    }


@router.get("")
async def list_documents(
    user_id: str = Depends(get_current_user),
):
    upload_dir = Path("uploads")
    if not upload_dir.exists():
        return []

    documents = []
    for file_path in upload_dir.iterdir():
        if file_path.is_file() and not file_path.name.startswith("."):
            stat = file_path.stat()
            documents.append({
                "id": file_path.stem,
                "filename": file_path.name,
                "file_size": stat.st_size,
                "status": "indexed",
                "chunks_count": 0,
                "uploaded_at": stat.st_mtime,
            })

    return documents