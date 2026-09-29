from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.health import router as health_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router

app = FastAPI(
    title=settings.APP_NAME,
    description="DevMind AI Knowledge Workspace API Gateway",
    version="0.1.0",
)

# Enable Cross-Origin Resource Sharing (CORS) for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(documents_router)


@app.get("/")
async def root():
    return {
        "message": "DevMind API Gateway",
        "status": "online",
        "version": "0.1.0",
    }