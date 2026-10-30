/**
 * Utility functions for St. Xavier Portal
 */

/**
 * Normalizes batch year strings across submissions and filters.
 * Replaces spaces/dashes between years with a standardized en-dash (e.g. "2021-2024" -> "2021–2024"),
 * and strips common prefixes like "Batch of " or "Class of ".
 */
export function normalizeBatchYear(raw?: string): string {
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim();
  // Strip leading prefixes like "Batch of " or "Class of "
  clean = clean.replace(/^(batch\s+of|class\s+of)\s+/i, "").trim();
  // Normalize any whitespace and hyphens/dashes between 4-digit years to en-dash "–"
  clean = clean.replace(/(\b\d{4}\b)\s*[-–—]\s*(\b\d{4}\b)/g, "$1–$2");
  return clean;
}
