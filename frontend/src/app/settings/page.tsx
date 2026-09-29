"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  Settings,
  Database,
  Sliders,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 font-sans antialiased text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="System Settings"
          subtitle="Configure system connections, LLM parameters, and infrastructure"
        />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8" role="main">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-3xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Service Endpoints & Status
                  </h2>
                  <p className="text-xs text-gray-400">
                    Infrastructure addresses targeted by DevMind services
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-gray-950/60 p-3.5 border border-gray-800 text-xs">
                  <div>
                    <span className="font-semibold text-white">FastAPI Backend</span>
                    <p className="text-gray-400 text-[11px]">http://localhost:8000</p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-400 border border-cyan-500/20">
                    Connecting in Phase 2
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-950/60 p-3.5 border border-gray-800 text-xs">
                  <div>
                    <span className="font-semibold text-white">PostgreSQL Database</span>
                    <p className="text-gray-400 text-[11px]">localhost:5432 / devmind</p>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400 border border-indigo-500/20">
                    Target: Phase 3
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-950/60 p-3.5 border border-gray-800 text-xs">
                  <div>
                    <span className="font-semibold text-white">Qdrant Vector Database</span>
                    <p className="text-gray-400 text-[11px]">http://localhost:6333</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                    Target: Phase 8
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-gray-950/60 p-3.5 border border-gray-800 text-xs">
                  <div>
                    <span className="font-semibold text-white">Redis Cache & Queue</span>
                    <p className="text-gray-400 text-[11px]">redis://localhost:6379</p>
                  </div>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400 border border-amber-500/20">
                    Target: Phase 19
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    AI Model & Inference Settings
                  </h2>
                  <p className="text-xs text-gray-400">
                    Default model providers and generation parameters
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Primary LLM Model
                  </label>
                  <input
                    type="text"
                    disabled
                    value="google:gemini-2.5-flash / gemini-3.0"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-gray-400 outline-none"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Configured via GOOGLE_API_KEY in backend/.env
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-gray-300 mb-1">
                    Embedding Dimension
                  </label>
                  <input
                    type="text"
                    disabled
                    value="384 (all-MiniLM-L6-v2) / 768 (text-embedding-004)"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 py-2.5 text-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
