export type DocumentStatus = "uploaded" | "processing" | "indexed" | "failed";

export interface DocumentItem {
  id: string;
  filename: string;
  file_size: number;
  status: DocumentStatus;
  chunks_count?: number;
  uploaded_at: string;
}

export interface SourceCitation {
  document_id: string;
  filename?: string;
  chunk_index: number;
  score?: number;
  text?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  sources?: SourceCitation[];
  isStreaming?: boolean;
}

export interface BackendHealthResponse {
  status: string;
  redis: boolean;
  qdrant: boolean;
  qdrant_collections: number;
}
