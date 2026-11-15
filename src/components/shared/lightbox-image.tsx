import { useState } from "react";
import { ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LightboxImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imageClassName?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

export function LightboxImage({
  src,
  alt,
  caption,
  className,
  imageClassName,
  loading = "lazy",
  width,
  height,
}: LightboxImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open full-size image: ${alt}`}
        className={cn(
          "group relative block w-full cursor-zoom-in overflow-hidden bg-muted text-left focus-visible:outline-none",
          className,
        )}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn("h-full w-full", imageClassName)}
          loading={loading}
          decoding="async"
        />
        <span
          className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-sm bg-background/90 text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <ZoomIn size={14} />
        </span>
      </button>

      <DialogContent className="max-h-[95vh] max-w-[95vw] border-border sm:max-w-5xl">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <DialogDescription className="sr-only">
          {caption || alt}
        </DialogDescription>
        <img
          src={src}
          alt={alt}
          className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
        />
        {caption ? (
          <p className="text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {caption}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
