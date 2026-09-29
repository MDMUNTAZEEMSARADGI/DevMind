"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, CornerDownLeft, Sparkles, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  return (
    <div className="border-t border-gray-800/80 bg-gray-950/80 p-4 sm:p-6 backdrop-blur-md">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex flex-col rounded-2xl border border-gray-800 bg-gray-900/90 shadow-xl shadow-black/40 focus-within:border-cyan-500/60 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask questions about your uploaded knowledge documents..."
            className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-gray-100 placeholder-gray-400 outline-none"
            aria-label="Chat query input"
          />

          <div className="flex items-center justify-between border-t border-gray-800/50 px-3 py-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Phase 1 UI State</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-gray-400">
                Press Enter to send
              </span>
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-gray-950 transition-all hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>

        <p className="mt-2 text-center text-[11px] text-gray-400">
          DevMind Phase 1: Pure frontend foundation. LLM streaming & tool events connect in later phases.
        </p>
      </div>
    </div>
  );
}
