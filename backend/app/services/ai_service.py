from dotenv import load_dotenv
from pydantic_ai import Agent

load_dotenv()


agent = Agent(
    "google:gemini-3.6-flash",
    system_prompt="""You are a helpful AI assistant for DevMind.

Answer the user's question using the provided context when relevant.
If the context does not contain enough information, say that clearly.
""",
)


async def generate_ai_response(
    message: str,
    context: list[dict] | None = None,
) -> str:

    context_text = "\n\n".join(
        item["text"]
        for item in (context or [])
    )

    prompt = f"""
Context from DevMind knowledge base:

{context_text}

User question:
{message}
"""

    result = await agent.run(prompt)

    return result.output