# 🧠 DevMind — AI Knowledge Workspace

DevMind is an end-to-end full-stack, agentic AI, and DevOps learning project built from the ground up to understand the entire modern software development lifecycle.

---

## 🎯 Target Architecture

```
                     USER
                       │
                       ▼
                ┌─────────────┐
                │   Browser   │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │   Next.js   │
                │  Frontend   │
                └──────┬──────┘
                       │
                   AG-UI
                       │
                       ▼
                ┌─────────────┐
                │   FastAPI   │
                │   Backend   │
                └──────┬──────┘
                       │
            ┌──────────┼───────────┐
            │          │           │
            ▼          ▼           ▼
      PostgreSQL     Redis       Qdrant
            │          │           │
            │          │           │
            └──────────┼───────────┘
                       │
                       ▼
                ┌─────────────┐
                │ Pydantic AI │
                │    Agent    │
                └──────┬──────┘
                       │
          ┌────────────┼─────────────┐
          │            │             │
          ▼            ▼             ▼
     Agent Tools    Retrieval       Memory
                       │
                       ▼
                     Qdrant
                       │
                       ▼
                  Embeddings
                       │
                       ▼
                       LLM
                       │
                       ▼
                Streaming Events
                       │
                       ▼
                     AG-UI
                       │
                       ▼
                   Next.js
                       │
                       ▼
                      USER
```

---

## 🗺️ Progressive Milestone Roadmap

- [x] **Phase 0: Workspace Cleanup & Git Setup**
- [x] **Phase 1: Frontend Foundation (Sidebar, Navigation, Accessible Design)**
- [x] **Phase 2: Frontend ↔ Backend Connection**
- [ ] **Phase 3: Relational Persistence with PostgreSQL**
- [ ] **Phase 4: Authentication & User Accounts**
- [ ] **Phase 5: Document Management & File Storage**
- [ ] **Phase 6: Ingestion Pipeline & Background Processing**
- [ ] **Phase 7: Understanding Embeddings**
- [ ] **Phase 8: Vector Storage with Qdrant**
- [ ] **Phase 9: Semantic Search**
- [ ] **Phase 10: RAG (Retrieval-Augmented Generation)**
- [ ] **Phase 11: LLM Integration & Provider Layer**
- [ ] **Phase 12: Pydantic AI Agent Architecture**
- [ ] **Phase 13: Agent Tools**
- [ ] **Phase 14: Streaming Responses**
- [ ] **Phase 15: AG-UI Protocol**
- [ ] **Phase 16: Generative UI**
- [ ] **Phase 17: Multi-tiered AI Memory**
- [ ] **Phase 18: Human-in-the-Loop**
- [ ] **Phase 19: Cache Optimization & Redis Scaling**
- [ ] **Phase 20: Comprehensive Testing (Pytest, Playwright)**
- [ ] **Phase 21: Production Docker & Compose Orchestration**
- [ ] **Phase 22: Git/GitHub Feature-Branch Workflow**
- [ ] **Phase 23: CI/CD with GitHub Actions**
- [ ] **Phase 24: Production Deployment**
- [ ] **Phase 25: Monitoring & AI Observability**

---

## 🚀 Quickstart (Local Development)

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
