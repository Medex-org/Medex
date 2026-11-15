export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function absoluteUrlForHash(anchor: string): string {
  if (typeof window === "undefined") return `#${anchor}`;
  const url = new URL(window.location.href);
  url.hash = anchor;
  return url.toString();
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function imageExtension(src: string): string {
  try {
    const pathname = new URL(src, window.location.origin).pathname;
    const match = /\.([a-z0-9]+)$/i.exec(pathname);
    const ext = match?.[1]?.toLowerCase();
    if (ext && ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"].includes(ext)) {
      return ext === "jpeg" ? "jpg" : ext;
    }
  } catch {
  }
  return "jpg";
}

export async function downloadImage(src: string, fileName: string): Promise<void> {
  const response = await fetch(src, { cache: "no-store" });
  if (!response.ok) throw new Error(`Image download failed (${response.status}).`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
