"""
Phase 2 Verification Script:
Verifies FastAPI endpoints using TestClient to ensure CORS, health, documents,
and chat endpoints respond with proper status codes and schemas.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_connection():
    print("--- 1. Testing GET / (Root Gateway) ---")
    res_root = client.get("/")
    print(f"Status: {res_root.status_code}, Body: {res_root.json()}")
    assert res_root.status_code == 200

    print("\n--- 2. Testing GET /health (Resilient Health Check) ---")
    res_health = client.get("/health")
    print(f"Status: {res_health.status_code}, Body: {res_health.json()}")
    assert res_health.status_code == 200
    assert res_health.json()["backend"] is True

    print("\n--- 3. Testing GET /documents (Document Listing) ---")
    res_docs = client.get("/documents")
    print(f"Status: {res_docs.status_code}, Count: {len(res_docs.json())}")
    assert res_docs.status_code == 200
    for doc in res_docs.json():
        print(f"  Found doc: {doc['filename']} ({doc['file_size']} bytes)")

    print("\n--- 4. Testing CORS Preflight (OPTIONS request from localhost:3000) ---")
    res_cors = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )
    print(f"CORS Status: {res_cors.status_code}")
    print(f"CORS Allow Origin: {res_cors.headers.get('access-control-allow-origin')}")
    assert res_cors.headers.get("access-control-allow-origin") == "http://localhost:3000"

    print("\n--- 5. Testing POST /chat (End-to-End Chat Request) ---")
    res_chat = client.post("/chat", json={"message": "What is DevMind?"})
    print(f"Status: {res_chat.status_code}, Response snippet: {res_chat.json()['response'][:80]}...")
    assert res_chat.status_code == 200

    print("\n[SUCCESS] ALL PHASE 2 API VERIFICATIONS PASSED!")

if __name__ == "__main__":
    test_connection()
