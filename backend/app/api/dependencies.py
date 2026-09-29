from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import verify_token


from app.core.config import settings

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
):
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