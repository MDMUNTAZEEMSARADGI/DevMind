"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DocumentsContainer } from "@/components/documents/DocumentsContainer";

export default function DocumentsPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 font-sans antialiased text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="Knowledge Documents"
          subtitle="Manage ingested files, inspect chunks, and track vector indexing status"
        />
        <main className="flex-1 overflow-hidden" role="main">
          <DocumentsContainer />
        </main>
      </div>
    </div>
  );
}
