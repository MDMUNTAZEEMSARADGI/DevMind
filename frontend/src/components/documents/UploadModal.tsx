"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, ArrowUpCircle } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadFile: (file: File) => void;
}

export function UploadModal({ isOpen, onClose, onUploadFile }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const ALLOWED_TYPES = [
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateAndSelect = (file: File) => {
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["txt", "pdf", "docx"];

    if (!validExts.includes(ext || "")) {
      setError("Unsupported file format. Please upload .pdf, .docx, or .txt.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File exceeds maximum size limit (25MB).");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) return;
    onUploadFile(selectedFile);
    setSelectedFile(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h2 id="upload-modal-title" className="text-sm font-semibold text-white">
                Upload Knowledge Document
              </h2>
              <p className="text-xs text-gray-400">
                Supports PDF, DOCX, and TXT files up to 25MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/5 scale-[1.01]"
              : "border-gray-800 bg-gray-900/40 hover:border-gray-700 hover:bg-gray-900/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-800/80 text-cyan-400 mb-3 border border-gray-700/60 shadow-inner">
            <ArrowUpCircle className="h-7 w-7" />
          </div>

          <p className="text-sm font-medium text-gray-200">
            Click to browse or drag & drop files here
          </p>
          <p className="mt-1 text-xs text-gray-400">
            PDF, DOCX, TXT (Max 25MB)
          </p>
        </div>

        {/* Selected File Feedback */}
        {selectedFile && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs font-medium text-white truncate max-w-[240px]">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-gray-400">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-gray-400 hover:text-rose-400 transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-400 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile}
            onClick={handleConfirmUpload}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-semibold text-gray-950 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-cyan-500/20"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
