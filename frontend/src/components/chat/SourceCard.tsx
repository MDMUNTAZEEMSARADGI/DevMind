"use client";

import { FileText, ExternalLink, Sparkles } from "lucide-react";
import { SourceCitation } from "@/types";

interface SourceCardProps {
  source: SourceCitation;
}

export function SourceCard({ source }: SourceCardProps) {
  const scorePercent = source.score
    ? Math.round(source.score * 100)
    : undefined;

  return (
    <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-xs transition-colors hover:border-gray-700">
      <div className="flex items-center justify-between text-gray-400 mb-1.5">
        <div className="flex items-center gap-1.5 font-medium text-gray-300">
          <FileText className="h-3.5 w-3.5 text-cyan-400" />
          <span className="truncate max-w-[140px]">
            {source.filename || source.document_id}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">
            Chunk #{source.chunk_index}
          </span>
          {scorePercent !== undefined && (
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-2.5 w-2.5" />
              {scorePercent}%
            </span>
          )}
        </div>
      </div>

      {source.text && (
        <p className="line-clamp-3 text-[11px] text-gray-400 leading-relaxed font-mono bg-gray-950/60 p-2 rounded-lg border border-gray-900">
          {source.text}
        </p>
      )}
    </div>
  );
}
