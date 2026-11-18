import { useMemo, useRef, useState } from "react";
import { ExternalLink, FileText, Images, Link2, Search, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { MediaAsset } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import { copyText } from "@/lib/share";
import { ACCEPTED_FILE_TYPES, formatUploadError, mediaKind, validateUpload } from "../media-utils";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminEmptyState } from "./AdminEmptyState";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

function AssetPreview({ asset }: { asset: MediaAsset }) {
  const kind = mediaKind(asset.type, asset.fileName);
  if (kind === "image") {
    return (
      <img
        src={asset.src}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }
  const Icon = FileText;
  if (kind === "video") {
    return (
      <video
        src={asset.src}
        controls
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-contain bg-black"
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
      <Icon size={32} strokeWidth={1.4} aria-hidden="true" />
      <span className="font-mono text-[10px] uppercase tracking-widest">
        {kind === "pdf" ? "PDF" : kind === "document" ? "Document" : "File"}
      </span>
    </div>
  );
}

export function MediaLibrary() {
  const { media, removeMedia, uploadMediaFiles } = useAdminStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const copyAssetLink = async (asset: MediaAsset) => {
    const copied = await copyText(asset.src);
    toast(
      copied
        ? { title: "Link copied", description: asset.fileName }
        : { title: "Could not copy the link", description: asset.fileName, variant: "destructive" },
    );
  };

  const handleFiles = async (files: FileList | File[] | null | undefined) => {
    if (uploading) return;
    const list = Array.from(files || []);
    if (!list.length) return;

    const valid: File[] = [];
    const invalid: string[] = [];
    list.forEach((file) => {
      const validationError = validateUpload(file);
      if (validationError) invalid.push(`${file.name}: ${validationError}`);
      else valid.push(file);
    });

    if (invalid.length) {
      const preview = invalid.slice(0, 3).join(" · ");
      toast({
        title: invalid.length === 1 ? "One file was skipped" : `${invalid.length} files were skipped`,
        description: invalid.length > 3 ? `${preview} · +${invalid.length - 3} more` : preview,
        variant: "destructive",
      });
    }
    if (!valid.length) return;

    setUploading(true);
    try {
      const uploaded = await uploadMediaFiles(valid);
      toast({
        title: `${uploaded.length} file${uploaded.length === 1 ? "" : "s"} uploaded`,
        description: "The files are saved in Supabase storage.",
      });
    } catch (error) {
      toast({
        title: "Some uploads failed",
        description: formatUploadError(error),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
        description: formatUploadError(error),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Upload, preview, and manage the images, documents, and videos used by your public content."
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              multiple
              className="sr-only"
              aria-label="Choose files to upload"
              onChange={(event) => {
                void handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Upload size={16} aria-hidden="true" /> {uploading ? "Uploading..." : "Upload files"}
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
          {filtered.length} of {media.length} assets
        </p>
      </div>

      <div
        className="border-[1px] border-dashed border-border bg-accent/5 px-4 py-3 mb-6"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <p className="font-sans text-xs text-muted-foreground leading-relaxed">
          Upload images, PDFs, Word documents, or videos here, then select them
          from the content editors. Files can be up to 25 MB; videos up to 50 MB.
          You can select several files at once or drop them here. Files are stored
          in the Supabase <code>media</code> bucket and previewed here.
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
                <AssetPreview asset={asset} />
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

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-[1px] border-border">
                  <div className="flex flex-wrap items-center gap-1">
                    {asset.src && !asset.isLocal ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void copyAssetLink(asset)}
                        aria-label={`Copy link to ${asset.fileName}`}
                      >
                        <Link2 size={14} /> Copy link
                      </Button>
                    ) : null}
                    {asset.src ? (
                      <Button asChild variant="ghost" size="sm">
                        <a
                          href={asset.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${asset.fileName} in a new tab`}
                        >
                          <ExternalLink size={14} /> Open
                        </a>
                      </Button>
                    ) : null}
                  </div>
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
