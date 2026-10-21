"use client";

import {
  FileText,
  FileCode,
  File,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { DocumentItem, DocumentStatus } from "@/types";
import { formatBytes, formatTimestamp } from "@/lib/utils";

interface DocumentCardProps {
  document: DocumentItem;
  onDelete?: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-rose-400" />;
      case "docx":
      case "doc":
        return <File className="h-5 w-5 text-blue-400" />;
      case "txt":
      case "md":
        return <FileCode className="h-5 w-5 text-emerald-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "indexed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Indexed in Qdrant
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
            <Loader2 className="h-3 w-3 animate-spin" />
            Extracting & Chunking
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-3 w-3" />
            Processing Failed
          </span>
        );
      case "uploaded":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
            <Clock className="h-3 w-3" />
            Queued for Ingestion
          </span>
        );
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-gray-800/80 bg-gray-900/60 p-5 backdrop-blur-sm transition-all hover:border-gray-700/80 hover:bg-gray-900/90 shadow-lg shadow-black/20">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-950 border border-gray-800 shadow-inner">
              {getFileIcon(document.filename)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                {document.filename}
              </h3>
              <p className="text-xs text-gray-400">
                {formatBytes(document.file_size)} • Uploaded{" "}
                <time dateTime={document.uploaded_at} suppressHydrationWarning>
                  {formatTimestamp(document.uploaded_at)}
                </time>
              </p>
            </div>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(document.id)}
              className="text-gray-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10"
              aria-label={`Delete ${document.filename}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {getStatusBadge(document.status)}

          {document.chunks_count !== undefined && (
            <span className="rounded-full bg-gray-800/80 px-2.5 py-0.5 text-xs text-gray-400 border border-gray-700/50">
              {document.chunks_count} Semantic Chunks
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-gray-800/60 pt-3 text-[11px] text-gray-400 flex items-center justify-between">
        <span>ID: {document.id.slice(0, 12)}...</span>
        <span className="font-mono text-cyan-400/80">Qdrant Vector Space</span>
      </div>
    </div>
  );
}
