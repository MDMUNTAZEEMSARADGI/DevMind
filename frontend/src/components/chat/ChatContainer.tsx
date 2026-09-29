"use client";

import { useState, useRef, useEffect } from "react";
import { MessageItem } from "./MessageItem";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "@/types";
import { Sparkles, FileText, Database, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "assistant",
    content:
      "Welcome to **DevMind**! 🧠\n\nI am your AI Knowledge Assistant. Currently in **Phase 1 (Frontend Foundation)**, the user interface and component architecture are active. In future milestones, I will be wired to your FastAPI backend, PostgreSQL database, Qdrant vector retrieval, and Pydantic AI agent loop.\n\nYou can type a test query below to test the UI flow, or navigate to **Knowledge Documents** to explore the document ingestion interface.",
    timestamp: new Date().toISOString(),
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulated responsive feedback explaining next phase
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        content: `I received your query: "${content}"\n\n📌 **System Status**: The UI and message flow are functioning correctly. In **Phase 2**, this action will dispatch an HTTP POST request to FastAPI (/chat), and in **Phase 10**, it will retrieve semantic chunks from Qdrant before synthesizing an answer with an LLM.`,
        timestamp: new Date().toISOString(),
        sources: [
          {
            document_id: "architecture_spec_v1",
            filename: "DevMind_Architecture.md",
            chunk_index: 0,
            score: 0.94,
            text: "DevMind Target Architecture: Next.js Frontend -> FastAPI Gateway -> Qdrant Vector Retrieval -> Pydantic AI Agent -> Streaming AG-UI Events.",
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 450);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-950">
      {/* Scrollable Message History Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Architecture Quick-cards (shown on empty/initial view) */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-800/80 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-semibold text-gray-200">
                1. Ingest Documents
              </h3>
              <p className="mt-1 text-[11px] text-gray-400">
                Upload PDFs, DOCX, or TXT to extract text and build semantic embeddings.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/80 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                <Database className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-semibold text-gray-200">
                2. Vector Retrieval
              </h3>
              <p className="mt-1 text-[11px] text-gray-400">
                Qdrant performs high-dimensional similarity search on relevant chunks.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800/80 bg-gray-900/50 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <Bot className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-semibold text-gray-200">
                3. Agentic Synthesis
              </h3>
              <p className="mt-1 text-[11px] text-gray-400">
                Pydantic AI evaluates tools, grounds the answer, and cites sources.
              </p>
            </div>
          </div>

          {/* Messages list */}
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Dock */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
