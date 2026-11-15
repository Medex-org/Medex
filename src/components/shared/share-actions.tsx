import { useState } from "react";
import { ClipboardList, Download, Link2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import {
  absoluteUrlForHash,
  copyText,
  downloadImage,
  imageExtension,
  slugify,
  whatsappShareUrl,
} from "@/lib/share";
import { cn } from "@/lib/utils";

interface ShareActionsProps {
  title: string;
  anchor: string;
  caption?: string;
  image?: string | null;
  className?: string;
}

const actionClass =
  "inline-flex items-center gap-1.5 border-[1px] border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-secondary transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-wait disabled:opacity-60";

export function ShareActions({
  title,
  anchor,
  caption,
  image,
  className,
}: ShareActionsProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const link = absoluteUrlForHash(anchor);
  const shareText = caption ? `${caption}\n${link}` : `${title}\n${link}`;

  async function handleCopyLink() {
    const copied = await copyText(link);
    toast(
      copied
        ? { title: "Link copied", description: link }
        : { title: "Could not copy the link", description: link, variant: "destructive" },
    );
  }

  async function handleCopyCaption() {
    const copied = await copyText(shareText);
    toast(
      copied
        ? { title: "Caption copied", description: "Paste it with the link into your social post." }
        : { title: "Could not copy the caption", variant: "destructive" },
    );
  }

  function handleWhatsApp() {
    window.open(whatsappShareUrl(shareText), "_blank", "noopener,noreferrer");
  }

  async function handleDownload() {
    if (!image) return;
    setDownloading(true);
    try {
      const extension = imageExtension(image);
      await downloadImage(image, `${slugify(title) || "medx"}.${extension}`);
      toast({ title: "Image downloaded" });
    } catch {
      window.open(image, "_blank", "noopener,noreferrer");
      toast({
        title: "Opened the image",
        description: "Use the browser's download option to save it.",
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button type="button" onClick={handleCopyLink} className={actionClass} aria-label={`Copy link to ${title}`}>
        <Link2 size={12} aria-hidden="true" /> Copy link
      </button>
      <button type="button" onClick={handleWhatsApp} className={actionClass} aria-label={`Share ${title} on WhatsApp`}>
        <FaWhatsapp size={12} aria-hidden="true" /> WhatsApp
      </button>
      <button type="button" onClick={handleCopyCaption} className={actionClass} aria-label={`Copy caption for ${title}`}>
        <ClipboardList size={12} aria-hidden="true" /> Caption
      </button>
      {image ? (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={actionClass}
          aria-label={`Download image for ${title}`}
        >
          <Download size={12} aria-hidden="true" /> {downloading ? "Saving..." : "Image"}
        </button>
      ) : null}
    </div>
  );
}
