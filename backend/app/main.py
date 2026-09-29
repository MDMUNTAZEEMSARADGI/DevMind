from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router

app = FastAPI()

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(documents_router)

@app.get("/")
async def root():
    return {"message":"The root api"}





# from fastapi import FastAPI
# from app.api.health import router as health_router

# app = FastAPI();

# app.include_router(health_router)

# @app.get("/")
# async def root():
#     return {"message":"Welcome to DevMind API"}

# @app.get("/health")
# async def health():
#     return {"status":"healthy"}