import type { MediaAsset } from "./admin-types";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

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

export function resolveMimeType(file: Pick<File, "type" | "name">): string {
  const type = (file.type || "").toLowerCase();
  if (type && type !== "application/octet-stream") return type;
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return MIME_BY_EXTENSION[extension] || type;
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
  if (!ACCEPTED_MIME_TYPES.includes(resolveMimeType(file))) {
    return "Choose an image, PDF, Word document, or video file.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Files must be 25 MB or smaller.";
  }
  return null;
}
