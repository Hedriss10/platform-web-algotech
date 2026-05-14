import type {
  SafraBatchJobStatus,
  SafraBatchUploadAccepted,
} from "../types/safra";

const STORAGE_KEY = "safra.batch.modal.snapshot";

export type SafraBatchModalSnapshot = {
  accepted: SafraBatchUploadAccepted | null;
  jobStatus: SafraBatchJobStatus | null;
};

function parseAccepted(raw: unknown): SafraBatchUploadAccepted | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (
    typeof r.job_id !== "string" ||
    typeof r.status !== "string" ||
    typeof r.total_rows !== "number"
  ) {
    return null;
  }
  return {
    job_id: r.job_id,
    status: r.status,
    total_rows: r.total_rows,
  };
}

function parseJobStatus(raw: unknown): SafraBatchJobStatus | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const detail =
    r.detail === undefined || r.detail === null
      ? null
      : typeof r.detail === "string"
        ? r.detail
        : null;
  if (
    typeof r.job_id !== "string" ||
    typeof r.status !== "string" ||
    typeof r.total_rows !== "number" ||
    typeof r.processed_rows !== "number" ||
    typeof r.failed_rows !== "number"
  ) {
    return null;
  }
  return {
    job_id: r.job_id,
    status: r.status,
    total_rows: r.total_rows,
    processed_rows: r.processed_rows,
    failed_rows: r.failed_rows,
    detail,
  };
}

export function getStoredSafraBatchModalSnapshot(): SafraBatchModalSnapshot | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const rec = o as Record<string, unknown>;
    const accepted = parseAccepted(rec.accepted);
    const jobStatus = parseJobStatus(rec.jobStatus);
    if (!accepted && !jobStatus) return null;
    return { accepted, jobStatus };
  } catch {
    return null;
  }
}

export function setStoredSafraBatchModalSnapshot(
  accepted: SafraBatchUploadAccepted | null,
  jobStatus: SafraBatchJobStatus | null
): void {
  try {
    if (!accepted && !jobStatus) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accepted, jobStatus })
    );
  } catch {
    /* quota ou modo privado */
  }
}
