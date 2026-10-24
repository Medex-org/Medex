const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export function mediaUrl(fileName: string): string {
  if (!SUPABASE_URL) return "";
  return `${SUPABASE_URL}/storage/v1/object/public/media/site/${encodeURIComponent(fileName)}`;
}
