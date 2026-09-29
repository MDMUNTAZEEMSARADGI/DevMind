"use client";

import { useState, useEffect } from "react";
import { DocumentCard } from "./DocumentCard";
import { UploadModal } from "./UploadModal";
import { DocumentItem } from "@/types";
import {
  Upload,
  Search,
  FileText,
  Filter,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { fetchDocuments, uploadDocumentFile } from "@/lib/api";

export function DocumentsContainer() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setError(err.message || "Failed to load documents from backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadFile = async (file: File) => {
    const tempId = `temp-${Date.now()}`;
    const pendingDoc: DocumentItem = {
      id: tempId,
      filename: file.name,
      file_size: file.size,
      status: "processing",
      uploaded_at: new Date().toISOString(),
    };

    setDocuments((prev) => [pendingDoc, ...prev]);

    try {
      const savedDoc = await uploadDocumentFile(file);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === tempId ? savedDoc : doc))
      );
    } catch (err: any) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === tempId
            ? { ...doc, status: "failed" }
            : doc
        )
      );
    }
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-gray-950 p-6 sm:p-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        {/* Banner Explaining RAG Pipeline */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900/60 to-gray-950 p-6 shadow-xl shadow-black/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Knowledge Document Registry
              </h2>
            </div>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              Documents added here are chunked into semantic segments, converted
              into dense vector embeddings, and indexed into Qdrant for semantic
              retrieval during conversation.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-xs font-semibold text-gray-950 hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uploaded documents..."
              className="w-full rounded-2xl border border-gray-800 bg-gray-900/70 pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <button
              type="button"
              onClick={loadDocuments}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/80 px-2.5 py-1.5 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh from FastAPI backend"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
              <span>Sync</span>
            </button>
            <span>
              Total:{" "}
              <strong className="text-white">{documents.length}</strong> files
            </span>
            <span>•</span>
            <span>
              Indexed:{" "}
              <strong className="text-emerald-400">
                {documents.filter((d) => d.status === "indexed").length}
              </strong>
            </span>
          </div>
        </div>

        {/* Document Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-800 p-12 text-center bg-gray-900/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800 text-gray-400 mb-4">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              No documents found
            </h3>
            <p className="mt-1 text-xs text-gray-400 max-w-sm">
              {searchQuery
                ? "No uploaded documents matched your search filter."
                : "Upload your first PDF, DOCX, or TXT file to populate the DevMind knowledge base."}
            </p>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Now</span>
            </button>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadFile={handleUploadFile}
      />
    </div>
  );
}
