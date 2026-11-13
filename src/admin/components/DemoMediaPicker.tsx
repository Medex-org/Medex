import { useMemo, useRef, useState } from "react";
import { Check, FileText, Film, ImageIcon, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { MediaAsset } from "../admin-types";
import { useAdminStore } from "../use-admin-store";
import {
  ACCEPTED_FILE_TYPES,
  ACCEPTED_IMAGE_TYPES,
  isImageAsset,
  mediaKind,
} from "../media-utils";

function KindIcon({ asset }: { asset: MediaAsset }) {
  const kind = mediaKind(asset.type, asset.fileName);
  const className = "h-4 w-4 text-secondary";
  if (kind === "video") return <Film className={className} aria-hidden="true" />;
  if (kind === "pdf" || kind === "document") {
    return <FileText className={className} aria-hidden="true" />;
  }
  return <ImageIcon className={className} aria-hidden="true" />;
}

export function DemoMediaPicker({
  id,
  media,
  value,
  onChange,
  imagesOnly = true,
}: {
  id: string;
  media: MediaAsset[];
  value: string | null;
  onChange: (value: string | null) => void;
  imagesOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia } = useAdminStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);

  const selected = media.find((asset) => asset.id === value) ?? null;

  const available = useMemo(() => {
    const query = search.trim().toLowerCase();
    return media.filter((asset) => {
      if (imagesOnly && !isImageAsset(asset)) return false;
      if (!query) return true;
      return (
        asset.fileName.toLowerCase().includes(query) ||
        (asset.type || "").toLowerCase().includes(query)
      );
    });
  }, [media, search, imagesOnly]);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    if (imagesOnly && !isImageAsset({ type: file.type, fileName: file.name })) {
      toast({
        title: "Unsupported file",
        description: "Choose an image file for this field.",
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      const asset = await uploadMedia(file);
      onChange(asset.id);
      toast({
        title: "File uploaded",
        description: "The file is now available in the media library.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Could not upload file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const select = (next: string | null) => {
    onChange(next);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={imagesOnly ? ACCEPTED_IMAGE_TYPES : ACCEPTED_FILE_TYPES}
        className="sr-only"
        onChange={(event) => {
          void handleUpload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id={id} type="button" variant="outline" className="justify-start">
              {selected ? (
                <>
                  {isImageAsset(selected) ? (
                    <img
                      src={selected.src}
                      alt=""
                      className="h-5 w-5 object-cover border-[1px] border-border"
                    />
                  ) : (
                    <KindIcon asset={selected} />
                  )}
                  <span className="max-w-[12rem] truncate">{selected.fileName}</span>
                </>
              ) : (
                <>
                  <ImageIcon size={14} aria-hidden="true" />
                  {imagesOnly ? "Select image" : "Select file"}
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-[min(92vw,26rem)] p-0"
            sideOffset={6}
          >
            <div className="flex items-center gap-2 border-b-[1px] border-border p-2">
              <div className="relative flex-1">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  autoFocus
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={imagesOnly ? "Search images" : "Search files"}
                  className="h-8 pl-8"
                  aria-label={imagesOnly ? "Search images" : "Search files"}
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={14} aria-hidden="true" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>

            <ScrollArea className="h-64">
              <div className="p-1">
                {!imagesOnly ? (
                  <button
                    type="button"
                    onClick={() => select(null)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-muted"
                  >
                    <ImageIcon size={16} className="text-muted-foreground" aria-hidden="true" />
                    No file
                    {!value ? <Check size={14} className="ml-auto text-accent" /> : null}
                  </button>
                ) : null}
                {available.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No media matches this search.
                  </p>
                ) : (
                  available.map((asset) => {
                    const active = asset.id === value;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => select(asset.id)}
                        className={`flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left text-sm hover:bg-muted ${
                          active ? "bg-accent/10" : ""
                        }`}
                      >
                        {isImageAsset(asset) ? (
                          <img
                            src={asset.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="h-10 w-14 shrink-0 object-cover border-[1px] border-border"
                          />
                        ) : (
                          <span className="flex h-10 w-14 shrink-0 items-center justify-center border-[1px] border-border bg-muted">
                            <KindIcon asset={asset} />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{asset.fileName}</span>
                          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {asset.type || "file"} · {asset.sizeLabel}
                          </span>
                        </span>
                        {active ? (
                          <Check size={14} className="shrink-0 text-accent" aria-hidden="true" />
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {value ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => select(null)}>
            Clear
          </Button>
        ) : null}
      </div>
      {selected ? (
        <div className="flex items-center gap-3 border-[1px] border-border bg-background p-2">
          {isImageAsset(selected) ? (
            <img
              src={selected.src}
              alt=""
              className="h-14 w-20 object-cover border-[1px] border-border"
            />
          ) : (
            <span className="flex h-14 w-20 items-center justify-center border-[1px] border-border bg-muted">
              <KindIcon asset={selected} />
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{selected.fileName}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {selected.isLocal ? "Local preview" : "Uploaded media"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
