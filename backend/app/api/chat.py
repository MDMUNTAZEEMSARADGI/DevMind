import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.dependencies import get_current_user_entity
from app.db.session import get_db
from app.models.chat import (
    ChatRequest,
    ChatResponse,
    Conversation,
    Message,
    Source,
)
from app.models.user import User
from app.services.chat_service import generate_response

router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    # 1. Resolve or create Conversation
    conversation = None
    if request.conversation_id:
        try:
            conv_uuid = uuid.UUID(request.conversation_id)
            stmt = select(Conversation).where(
                Conversation.id == conv_uuid,
                Conversation.user_id == current_user.id,
            )
            result = await db.execute(stmt)
            conversation = result.scalar_one_or_none()
        except ValueError:
            conversation = None

    if not conversation:
        title_snippet = (request.message[:45] + "...") if len(request.message) > 45 else request.message
        conversation = Conversation(
            user_id=current_user.id,
            title=title_snippet.strip() or "New Conversation",
        )
        db.add(conversation)
        await db.flush()
        await db.refresh(conversation)

    # 2. Persist incoming User Message
    user_msg = Message(
        conversation_id=conversation.id,
        sender="user",
        content=request.message,
    )
    db.add(user_msg)
    await db.flush()

    # 3. Generate response via chat service
    result = await generate_response(request.message)

    # 4. Serialize citations for database JSON storage
    raw_sources = result.get("sources", [])
    sources_data = [
        s.model_dump() if hasattr(s, "model_dump") else s
        for s in raw_sources
    ]

    # 5. Persist Assistant Message
    assistant_msg = Message(
        conversation_id=conversation.id,
        sender="assistant",
        content=result.get("response", ""),
        sources={"sources": sources_data},
    )
    db.add(assistant_msg)
    await db.flush()

    return ChatResponse(
        response=result["response"],
        sources=result["sources"],
        conversation_id=str(conversation.id),
    )


@router.get("/conversations")
async def list_conversations(
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns all conversations belonging to the authenticated user.
    """
    stmt = (
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
    )
    result = await db.execute(stmt)
    conversations = result.scalars().all()

    return [
        {
            "id": str(c.id),
            "title": c.title,
            "created_at": c.created_at.isoformat(),
        }
        for c in conversations
    ]


@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    current_user: User = Depends(get_current_user_entity),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns the message history for a given conversation.
    """
    try:
        conv_uuid = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid conversation ID")

    stmt = (
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            Conversation.id == conv_uuid,
            Conversation.user_id == current_user.id,
        )
    )
    result = await db.execute(stmt)
    conversation = result.scalar_one_or_none()

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return [
        {
            "id": str(msg.id),
            "sender": msg.sender,
            "content": msg.content,
            "sources": msg.sources.get("sources", []) if msg.sources else [],
            "created_at": msg.created_at.isoformat(),
        }
        for msg in conversation.messages
    ]