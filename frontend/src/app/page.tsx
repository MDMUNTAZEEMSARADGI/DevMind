"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function ChatPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 font-sans antialiased text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="AI Workspace & Chat"
          subtitle="Grounding conversations with multi-document vector retrieval"
        />
        <main className="flex-1 overflow-hidden" role="main">
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}