"""
Phase 3 Verification Script:
Verifies PostgreSQL relational persistence with SQLAlchemy 2.0 and Alembic.
Tests health check, document uploads, conversation & message storage, and relational queries.
"""
import asyncio
from io import BytesIO
import uuid
import httpx
from sqlalchemy import select, func
from app.main import app
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.document import Document
from app.models.chat import Conversation, Message


async def run_phase3_tests():
    print("=" * 60)
    print("DEV MIND - PHASE 3 POSTGRESQL VERIFICATION")
    print("=" * 60)

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check with PostgreSQL
        print("\n--- 1. Testing GET /health (Database Connectivity) ---")
        res = await client.get("/health")
        assert res.status_code == 200, f"Health check failed: {res.text}"
        data = res.json()
        print(f"Health Response: {data}")
        assert data["backend"] is True, "Backend flag should be True"
        assert data["postgres"] is True, "PostgreSQL should be reported as True (healthy)"
        print("  [PASS] PostgreSQL connectivity verified via /health")

        # 2. Document Upload with DB Persistence
        print("\n--- 2. Testing POST /documents/upload (Document Persistence) ---")
        test_filename = f"phase3_test_{uuid.uuid4().hex[:6]}.txt"
        test_content = b"DevMind Phase 3 PostgreSQL persistence test document content."
        files = {
            "file": (test_filename, BytesIO(test_content), "text/plain")
        }
        res = await client.post("/documents/upload", files=files)
        assert res.status_code == 200, f"Upload failed: {res.text}"
        doc_data = res.json()
        print(f"Uploaded Doc Response: {doc_data}")
        doc_id = doc_data["id"]
        assert doc_data["filename"] == test_filename
        assert doc_data["status"] == "indexed"
        print("  [PASS] Document upload endpoint returned successful response with UUID")

        # 3. Direct PostgreSQL Row Verification for Document
        print("\n--- 3. Verifying Document Record in PostgreSQL via SQLAlchemy ---")
        async with AsyncSessionLocal() as session:
            db_doc = await session.get(Document, uuid.UUID(doc_id))
            assert db_doc is not None, f"Document with id {doc_id} not found in PostgreSQL"
            assert db_doc.filename == test_filename
            print(f"  Found Document in PostgreSQL: id={db_doc.id}, user_id={db_doc.user_id}, filename={db_doc.filename}, status={db_doc.status}")
        print("  [PASS] Document row physically exists in PostgreSQL")

        # 4. Document Listing API
        print("\n--- 4. Testing GET /documents (ORM Query Listing) ---")
        res = await client.get("/documents")
        assert res.status_code == 200
        docs_list = res.json()
        print(f"Document list count: {len(docs_list)}")
        assert any(d["id"] == doc_id for d in docs_list), "Uploaded document not in listing"
        print("  [PASS] GET /documents returned persisted records from database")

        # 5. Chat Interaction with Conversation & Message Persistence
        print("\n--- 5. Testing POST /chat (Conversation & Message Persistence) ---")
        chat_msg = "Explain why relational databases are essential for DevMind."
        res = await client.post("/chat", json={"message": chat_msg})
        assert res.status_code == 200, f"Chat failed: {res.text}"
        chat_data = res.json()
        print(f"Chat Response: snippet={chat_data['response'][:70]}...")
        conv_id = chat_data.get("conversation_id")
        assert conv_id is not None, "conversation_id must be returned"
        print(f"Conversation ID: {conv_id}")
        print("  [PASS] Chat endpoint created conversation and returned response")

        # 6. Direct PostgreSQL Verification for Chat Relational Data
        print("\n--- 6. Verifying Conversation & Messages in PostgreSQL ---")
        async with AsyncSessionLocal() as session:
            db_conv = await session.get(Conversation, uuid.UUID(conv_id))
            assert db_conv is not None, "Conversation record not found in PostgreSQL"
            print(f"  Conversation in PostgreSQL: title='{db_conv.title}', user_id={db_conv.user_id}")

            msg_stmt = (
                select(Message)
                .where(Message.conversation_id == db_conv.id)
                .order_by(Message.created_at.asc())
            )
            res_msgs = await session.execute(msg_stmt)
            messages = res_msgs.scalars().all()
            print(f"  Found {len(messages)} messages for conversation {conv_id}:")
            for m in messages:
                print(f"    - [{m.sender}]: {m.content[:50]}...")
            assert len(messages) >= 2, "Must have at least 1 user message and 1 assistant message"
            assert messages[0].sender == "user"
            assert messages[1].sender == "assistant"
        print("  [PASS] Relational entities (Conversation -> Messages) verified in PostgreSQL")

        # 7. List Conversations API
        print("\n--- 7. Testing GET /conversations ---")
        res = await client.get("/conversations")
        assert res.status_code == 200
        conv_list = res.json()
        print(f"Conversations list count: {len(conv_list)}")
        assert any(c["id"] == conv_id for c in conv_list)
        print("  [PASS] GET /conversations returned user conversation")

        # 8. Get Conversation Messages API
        print("\n--- 8. Testing GET /conversations/{id}/messages ---")
        res = await client.get(f"/conversations/{conv_id}/messages")
        assert res.status_code == 200
        hist = res.json()
        print(f"Retrieved {len(hist)} messages from API history")
        assert len(hist) >= 2
        print("  [PASS] GET /conversations/{id}/messages returned complete chronological history")

        # 9. Document Deletion
        print("\n--- 9. Testing DELETE /documents/{id} ---")
        res = await client.delete(f"/documents/{doc_id}")
        assert res.status_code == 200
        async with AsyncSessionLocal() as session:
            deleted_check = await session.get(Document, uuid.UUID(doc_id))
            assert deleted_check is None, "Document should be deleted from PostgreSQL"
        print("  [PASS] Document row successfully removed from PostgreSQL")

    print("\n" + "=" * 60)
    print("ALL PHASE 3 POSTGRESQL & RELATIONAL PERSISTENCE TESTS PASSED!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_phase3_tests())
