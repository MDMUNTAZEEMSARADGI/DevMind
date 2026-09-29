"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FileText,
  Settings,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { checkBackendHealth } from "@/lib/api";

export function Sidebar() {
  const pathname = usePathname();
  const [healthStatus, setHealthStatus] = useState<"checking" | "online" | "offline">("checking");
  const [redisStatus, setRedisStatus] = useState(false);
  const [qdrantStatus, setQdrantStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const pollHealth = async () => {
      try {
        const health = await checkBackendHealth();
        if (isMounted) {
          setHealthStatus("online");
          setRedisStatus(health.redis);
          setQdrantStatus(health.qdrant);
        }
      } catch {
        if (isMounted) {
          setHealthStatus("offline");
          setRedisStatus(false);
          setQdrantStatus(false);
        }
      }
    };

    pollHealth();
    const interval = setInterval(pollHealth, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    {
      label: "AI Workspace & Chat",
      href: "/",
      icon: MessageSquare,
      badge: "Agent",
    },
    {
      label: "Knowledge Documents",
      href: "/documents",
      icon: FileText,
      badge: "RAG",
    },
    {
      label: "System Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="flex h-screen w-72 flex-col border-r border-gray-800 bg-gray-950 text-gray-200 select-none"
      aria-label="Application navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-gray-800/80 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-md shadow-cyan-500/20">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-white">DevMind</span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-400 border border-indigo-500/30">
              v0.1
            </span>
          </div>
          <p className="text-xs text-gray-400">AI Knowledge Workspace</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Workspace
        </div>
        <nav className="space-y-1.5" role="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-gray-800/90 text-white shadow-sm shadow-black/40 border border-gray-700/60"
                    : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-cyan-400"
                        : "text-gray-400 group-hover:text-gray-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full border",
                      isActive
                        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        : "bg-gray-900 text-gray-400 border-gray-800"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Learning Milestone Progress Box */}
        <div className="mt-8 rounded-2xl border border-gray-800/80 bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Architecture Roadmap</span>
          </div>
          <p className="mt-1 text-xs text-gray-400 leading-relaxed">
            Phase 2: Connecting Frontend ↔ Backend.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>Milestone: 2 of 25</span>
            <span className="font-semibold text-cyan-400">Phase 2</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
              style={{ width: "8%" }}
            />
          </div>
        </div>
      </div>

      {/* Backend Status & User Footer */}
      <div className="border-t border-gray-800/80 p-4 space-y-3">
        {/* Backend Connectivity Indicator */}
        <div className="flex items-center justify-between rounded-xl bg-gray-900/80 px-3 py-2 border border-gray-800 text-xs">
          <div className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-gray-400">FastAPI (8000)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {healthStatus === "online" && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-emerald-400 text-[11px]">Online</span>
              </>
            )}
            {healthStatus === "offline" && (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="font-medium text-rose-400 text-[11px]">Offline</span>
              </>
            )}
            {healthStatus === "checking" && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <span className="font-medium text-amber-400 text-[11px]">Checking...</span>
              </>
            )}
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-xs text-white shadow-inner">
            DM
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-white">DevMind Learner</p>
            <p className="truncate text-[11px] text-gray-400">workspace-admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
