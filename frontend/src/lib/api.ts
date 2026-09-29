import { BackendHealthResponse, DocumentItem, ChatMessage, SourceCitation } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Checks connectivity and service health of the FastAPI backend.
 */
export async function checkBackendHealth(): Promise<BackendHealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new ApiError(res.status, `Health check failed: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, "Backend unreachable");
  }
}

/**
 * Fetches the list of ingested documents from the backend.
 */
export async function fetchDocuments(): Promise<DocumentItem[]> {
  const res = await fetch(`${API_BASE_URL}/documents`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Failed to fetch documents: ${res.statusText}`);
  }

  const data = await res.json();
  return data.map((doc: any) => ({
    id: String(doc.id),
    filename: doc.filename,
    file_size: doc.file_size || 0,
    status: doc.status || "indexed",
    chunks_count: doc.chunks_count,
    uploaded_at: typeof doc.uploaded_at === "number"
      ? new Date(doc.uploaded_at * 1000).toISOString()
      : doc.uploaded_at || new Date().toISOString(),
  }));
}

/**
 * Uploads a document file to the backend for text extraction & ingestion.
 */
export async function uploadDocumentFile(file: File): Promise<DocumentItem> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let detail = "Failed to upload document";
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }

  const data = await res.json();
  return {
    id: data.id || data.document_id || file.name,
    filename: data.filename || file.name,
    file_size: data.file_size || file.size,
    status: data.status || "indexed",
    chunks_count: data.chunks_count || data.chunks || 0,
    uploaded_at: typeof data.uploaded_at === "number"
      ? new Date(data.uploaded_at * 1000).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Sends a chat query to the backend and receives the response with citations.
 */
export async function postChatMessage(
  message: string
): Promise<{ response: string; sources: SourceCitation[] }> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    let detail = "Failed to communicate with AI chat endpoint";
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, detail);
  }

  return await res.json();
}
