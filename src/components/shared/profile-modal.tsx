import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, ExternalLink, BookOpen } from "lucide-react";

export interface Publication {
  title: string;
  venue?: string;
  url?: string;
}

export interface MentorProfile {
  name: string;
  role: string;
  image: string | null;
  bio: string;
  researchGateUrl?: string;
  publications?: Publication[];
}

interface ProfileModalProps {
  mentor: MentorProfile;
  trigger: React.ReactNode;
  /** Optional extra content rendered under the bio - e.g. a "Get Mentorship" CTA */
  footer?: React.ReactNode;
}

export function ProfileModal({ mentor, trigger, footer }: ProfileModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg border-border">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-[1px] border-border bg-muted flex-shrink-0 img-scholarly">
              {mentor.image ? (
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
                  <User size={24} strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl text-foreground break-words">{mentor.name}</DialogTitle>
              <p className="font-mono text-xs uppercase tracking-widest text-accent mt-1">
                {mentor.role}
              </p>
            </div>
          </div>
        </DialogHeader>

        <p className="font-sans text-sm text-muted-foreground leading-relaxed">{mentor.bio}</p>

        {mentor.researchGateUrl ? (
          <a
            href={mentor.researchGateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70 transition-opacity w-fit"
          >
            ResearchGate Profile <ExternalLink size={12} aria-hidden="true" />
          </a>
        ) : (
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            ResearchGate profile coming soon
          </p>
        )}

        <div className="pt-2 border-t-[1px] border-border">
          <h4 className="font-mono text-xs uppercase tracking-widest text-secondary mb-3 flex items-center gap-2 pt-4">
            <BookOpen size={13} aria-hidden="true" /> Selected Publications
          </h4>
          {mentor.publications && mentor.publications.length > 0 ? (
            <ul className="space-y-2">
              {mentor.publications.map((pub, i) => (
                <li key={i} className="text-sm font-sans text-muted-foreground leading-snug">
                  {pub.url ? (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors underline underline-offset-2">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                  {pub.venue && <span className="text-xs text-secondary"> - {pub.venue}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-sans text-muted-foreground italic">
              Publications will be listed here once submitted.
            </p>
          )}
        </div>

        {footer && <div className="pt-2 border-t-[1px] border-border">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
