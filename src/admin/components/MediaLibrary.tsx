import { useMemo, useRef, useState } from "react";
import { Images, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { MediaAsset } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminEmptyState } from "./AdminEmptyState";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function MediaLibrary() {
  const { media, removeMedia, uploadMedia } = useAdminStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return media;
    return media.filter(
      (asset) =>
        asset.fileName.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        asset.usedIn.some((usage) => usage.toLowerCase().includes(query)),
    );
  }, [media, search]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Choose an image file.",
      });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast({
        title: "Image too large",
        description: "Choose an image under 10 MB.",
      });
      return;
    }

    try {
      await uploadMedia(file);
      toast({ title: "Image uploaded", description: "The image is saved in Supabase storage." });
    } catch (error) {
      toast({ title: "Upload failed", description: error instanceof Error ? error.message : "Could not upload image.", variant: "destructive" });
    }
  };

  const confirmRemove = async () => {
    if (!deleteTarget) return;
    try {
      await removeMedia(deleteTarget.id);
      toast({
        title: "Media asset removed",
        description: "The asset was removed from the media library.",
      });
      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: "Could not remove media asset",
        description: error instanceof Error ? error.message : "Unknown error.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Upload, preview, and manage the images used by your public content."
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Choose an image to upload"
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Upload size={16} aria-hidden="true" /> Upload image
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media by file name, type, or usage"
            aria-label="Search media"
            className="pl-9 bg-card"
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {filtered.length} of {media.length} sample assets
        </p>
      </div>

      <div className="border-[1px] border-border bg-accent/5 px-4 py-3 mb-6">
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Upload an image here, then select it from any content editor. Images
          are stored in the Supabase <code>media</code> bucket and previewed here.
        </p>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={<Images size={28} strokeWidth={1.2} />}
          title="No media matches this search"
          description="Try another file name or usage term, or clear the search."
          action={
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="border-[1px] border-border bg-card overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img
                  src={asset.src}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm break-all">
                      {asset.fileName}
                    </p>
                    {asset.isLocal ? (
                      <span className="flex-shrink-0 border-[1px] border-dashed border-accent/40 bg-accent/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent">
                        Local
                      </span>
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    {asset.type} · {asset.sizeLabel}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-secondary mb-1">
                    Used in
                  </p>
                  {asset.usedIn.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Not used yet</p>
                  ) : (
                    <ul className="space-y-1">
                      {asset.usedIn.map((usage) => (
                        <li
                          key={usage}
                          className="text-xs text-muted-foreground line-clamp-2"
                        >
                          {usage}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t-[1px] border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(asset)}
                    aria-label={`Remove ${asset.fileName}`}
                  >
                    <Trash2 size={14} /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemLabel={deleteTarget?.fileName ?? ""}
        onConfirm={confirmRemove}
      />
    </>
  );
}
