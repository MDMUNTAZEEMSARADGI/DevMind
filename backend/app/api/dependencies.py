import uuid
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import verify_token
from app.db.session import get_db
from app.models.user import User

security = HTTPBearer(auto_error=False)

DEV_USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    if credentials is None:
        if settings.DEBUG:
            return "dev-user"
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
        )

    try:
        return verify_token(credentials.credentials)

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )


async def get_current_user_entity(
    user_identifier: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Resolves the authenticated user string into a persisted User relational entity.
    Guarantees that Foreign Key constraints are properly satisfied in PostgreSQL.
    """
    if user_identifier == "dev-user":
        stmt = select(User).where(User.id == DEV_USER_ID)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            user = User(
                id=DEV_USER_ID,
                email="dev@devmind.local",
                hashed_password="scaffolded_dev_password_hash",
                is_active=True,
            )
            db.add(user)
            await db.flush()
        return user

    try:
        user_uuid = uuid.UUID(user_identifier)
        stmt = select(User).where(User.id == user_uuid)
    except ValueError:
        stmt = select(User).where(User.email == user_identifier)

    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User account not found",
        )
    return user