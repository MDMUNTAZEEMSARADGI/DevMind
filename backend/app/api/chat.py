from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.models.chat import ChatRequest, ChatResponse
from app.services.chat_service import generate_response


router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
    user_id: str = Depends(get_current_user),
):

    result = await generate_response(
        request.message
    )

    return ChatResponse(
        response=result["response"],
        sources=result["sources"],
    )