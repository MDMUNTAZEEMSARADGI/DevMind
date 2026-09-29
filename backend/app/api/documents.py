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

        chunks = ingest_document(
            str(file_path)
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "document_id": file_path.stem,
        "chunks": chunks,
    }