"""
AI Service (Phase 2 Scaffolding):
Currently in Phase 2 (Connect Frontend ↔ Backend).
Real LLM integration with API credentials and model providers will be implemented in Phase 11.
Pydantic AI agent loops will be implemented in Phase 12.
"""

async def generate_ai_response(
    message: str,
    context: list[dict] | None = None,
) -> str:
    context_count = len(context or [])
    return (
        f"DevMind Backend (Phase 2 Scaffolding): Received query '{message}'. "
        f"Retrieved {context_count} context chunk(s). "
        f"Real LLM synthesis will be implemented in Phase 11."
    )