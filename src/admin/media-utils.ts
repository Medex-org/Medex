import type { MediaAsset } from "./admin-types";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export const ACCEPTED_FILE_TYPES = ACCEPTED_MIME_TYPES.join(",");
export const ACCEPTED_IMAGE_TYPES = "image/*";

export type MediaKind = "image" | "video" | "pdf" | "document" | "other";

export function mediaKind(type: string | null | undefined, fileName = ""): MediaKind {
  const mime = (type || "").toLowerCase();
  const name = fileName.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    mime === "application/msword" ||
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".doc") ||
    name.endsWith(".docx")
  ) {
    return "document";
  }
  return "other";
}

export function isImageAsset(asset: Pick<MediaAsset, "type" | "fileName">): boolean {
  return mediaKind(asset.type, asset.fileName) === "image";
}

export function validateUpload(file: File): string | null {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return "Choose an image, PDF, Word document, or video file.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Files must be 25 MB or smaller.";
  }
  return null;
}
