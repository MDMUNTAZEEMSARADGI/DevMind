"use client";

import { useState } from "react";
import { Bot, User, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { ChatMessage } from "@/types";
import { SourceCard } from "./SourceCard";
import { cn, formatTimestamp } from "@/lib/utils";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.sender === "user";
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const hasSources = message.sources && message.sources.length > 0;

  return (
    <article
      className={cn(
        "flex w-full gap-4 px-4 py-3 transition-colors",
        isUser ? "justify-end" : "justify-start"
      )}
      aria-label={`${message.sender} message at ${formatTimestamp(message.timestamp)}`}
    >
      <div
        className={cn(
          "flex max-w-2xl gap-3",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold shadow-sm",
            isUser
              ? "bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white"
              : "bg-gray-800 border border-gray-700 text-cyan-400"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Content Box */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
            <span className="font-semibold text-gray-300">
              {isUser ? "You" : "DevMind Assistant"}
            </span>
            <span>•</span>
            <time dateTime={message.timestamp}>
              {formatTimestamp(message.timestamp)}
            </time>
          </div>

          <div
            className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser
                ? "bg-indigo-600/90 text-white shadow-md shadow-indigo-950/40 rounded-tr-xs"
                : "bg-gray-900/90 text-gray-100 border border-gray-800/80 shadow-md shadow-black/30 rounded-tl-xs"
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>

            {message.isStreaming && (
              <span className="inline-block h-3.5 w-1.5 ml-1 animate-pulse bg-cyan-400 align-middle" />
            )}
          </div>

          {/* Sources and Citations Drawer */}
          {hasSources && (
            <div className="mt-1.5 px-1">
              <button
                type="button"
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium py-1 transition-colors cursor-pointer"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {message.sources!.length} Grounded Context Source
                  {message.sources!.length > 1 ? "s" : ""}
                </span>
                {sourcesExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {sourcesExpanded && (
                <div className="mt-2 grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                  {message.sources!.map((source, index) => (
                    <SourceCard
                      key={`${source.document_id}-${source.chunk_index}-${index}`}
                      source={source}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
