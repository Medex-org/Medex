import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MediaAsset } from "../admin-types";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "../use-admin-store";

export function DemoMediaPicker({
  id,
  media,
  value,
  onChange,
}: {
  id: string;
  media: MediaAsset[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const selected = media.find((asset) => asset.id === value) ?? null;
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadMedia } = useAdminStore();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMedia(file);
      onChange(asset.id);
      toast({ title: "Image uploaded", description: "The image is now available in the media library." });
    } catch (error) {
      toast({ title: "Image upload failed", description: error instanceof Error ? error.message : "Could not upload image.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => { void handleUpload(event.target.files?.[0]); event.target.value = ""; }} />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload size={14} /> {uploading ? "Uploading..." : "Upload image"}
      </Button>
      <Select
        value={value ?? "none"}
        onValueChange={(next) => onChange(next === "none" ? null : next)}
      >
        <SelectTrigger id={id} aria-label="Cover image">
          <SelectValue placeholder="No image selected" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No image</SelectItem>
          {media.map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              {asset.fileName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected ? (
        <div className="flex items-center gap-3 border-[1px] border-border bg-background p-2">
          <img
            src={selected.src}
            alt=""
            className="h-14 w-20 object-cover border-[1px] border-border"
          />
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
