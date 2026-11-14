export function mediaUrl(fileName: string): string {
  return `${import.meta.env.BASE_URL}assets/site/${encodeURIComponent(fileName)}`;
}
