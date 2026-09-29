from fastapi import APIRouter

from app.core.security import create_access_token


router = APIRouter(prefix="/auth")


@router.post("/login")
async def login():
    token = create_access_token("user-123")

    return {
        "access_token": token,
        "token_type": "bearer",
    }