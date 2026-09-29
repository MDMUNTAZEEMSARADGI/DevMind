"use client";

import { ReactNode } from "react";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800/80 bg-gray-950/70 px-8 backdrop-blur-md">
      <div>
        <h1 className="text-base font-semibold text-white tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* System Info Badges */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/60 px-2.5 py-1 text-[11px] text-gray-400">
            <Cpu className="h-3 w-3 text-cyan-400" />
            <span>Architecture: Clean UI</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-gray-800 bg-gray-900/60 px-2.5 py-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3 w-3 text-indigo-400" />
            <span>Auth: Scaffolding</span>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
