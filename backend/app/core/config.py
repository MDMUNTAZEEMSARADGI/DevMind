import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "DevMind")

    DEBUG: bool = os.getenv(
        "DEBUG",
        "true"
    ).lower() == "true"

    QDRANT_URL: str = os.getenv(
        "QDRANT_URL",
        "http://localhost:6333"
    )

    REDIS_URL: str = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379"
    )

    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "devmind-learning-secret"
    )

    JWT_ALGORITHM: str = os.getenv(
        "JWT_ALGORITHM",
        "HS256"
    )

    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv(
            "JWT_ACCESS_TOKEN_EXPIRE_MINUTES",
            "30"
        )
    )

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


settings = Settings()