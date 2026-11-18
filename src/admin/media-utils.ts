import type { MediaAsset } from "./admin-types";
import { formatFileSize, formatSupabaseError } from "./admin-utils";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
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
export const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml";

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export type MediaKind = "image" | "video" | "pdf" | "document" | "other";

function normalizeMimeType(type: string): string {
  const mime = type.toLowerCase();
  if (mime === "image/jpg" || mime === "image/pjpeg") return "image/jpeg";
  return mime;
}

export function resolveMimeType(file: Pick<File, "type" | "name">): string {
  const type = normalizeMimeType(file.type || "");
  if (type && type !== "application/octet-stream") return type;
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return normalizeMimeType(MIME_BY_EXTENSION[extension] || type);
}

export function isHeic(file: Pick<File, "type" | "name">): boolean {
  const mime = resolveMimeType(file);
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return mime === "image/heic" || mime === "image/heif" || extension === "heic" || extension === "heif";
}

export function mediaKind(type: string | null | undefined, fileName = ""): MediaKind {
  const mime = resolveMimeType({ type: type || "", name: fileName });
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
  if (isHeic(file)) {
    return "HEIC/HEIF photos are not supported by browsers. On iPhone, use Settings → Camera → Formats → Most Compatible, or export the photo as JPEG before uploading.";
  }
  const mimeType = resolveMimeType(file);
  if (!ACCEPTED_MIME_TYPES.includes(mimeType)) {
    return "Choose an image, PDF, Word document, or video file.";
  }
  const kind = mediaKind(mimeType, file.name);
  const limit = kind === "video" ? MAX_VIDEO_BYTES : MAX_UPLOAD_BYTES;
  if (file.size > limit) {
    const label = kind === "video" ? "Videos" : "Files";
    return `${label} must be ${formatFileSize(limit)} or smaller (this file is ${formatFileSize(file.size)}).`;
  }
  return null;
}

export function formatUploadError(error: unknown): string {
  const message = formatSupabaseError(error);
  const lower = message.toLowerCase();

  if (lower.includes("bucket not found")) {
    return `${message} — run supabase/schema.sql to create the media bucket.`;
  }
  if (lower.includes("mime type") || lower.includes("not supported")) {
    return `${message} — supported types: JPEG, PNG, WebP, GIF, SVG, PDF, Word, MP4, WebM, MOV.`;
  }
  if (lower.includes("row-level security") || lower.includes("permission") || lower.includes("not authorized") || lower.includes("403")) {
    return `${message} — check that your account has an admin/editor role and is signed in.`;
  }
  if (lower.includes("jwt") || lower.includes("token") || lower.includes("401")) {
    return `${message} — your session may have expired; sign out and back in.`;
  }
  if (lower.includes("maximum allowed size") || lower.includes("payload too large") || lower.includes("too large") || lower.includes("413") || lower.includes("exceeded")) {
    return `${message} — the limit is ${formatFileSize(MAX_VIDEO_BYTES)} for videos and ${formatFileSize(MAX_UPLOAD_BYTES)} for other files.`;
  }
  return message;
}
