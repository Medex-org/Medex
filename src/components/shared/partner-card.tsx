import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Building2 } from "lucide-react";

export interface Partner {
  name: string;
  description: string;
  logo?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

/**
 * Strict display rule: official logo, a 1-2 sentence description, and social
 * links only - no extra copy. `logo` is intentionally optional: MEDX has not
 * supplied a transparent partner wordmark/logo asset yet, so this falls back
 * to a plain typographic mark rather than substituting a promotional flyer.
 */
export function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="h-full p-8 border-[1px] border-border bg-card flex flex-col items-center text-center hover:border-accent/25 transition-colors">
      <div className="w-16 h-16 rounded-full border-[1px] border-border bg-background flex items-center justify-center mb-5" aria-hidden={!!partner.logo}>
        {partner.logo ? (
          <img src={partner.logo} alt={`${partner.name} logo`} className="w-full h-full object-contain rounded-full" loading="lazy" decoding="async" />
        ) : (
          <Building2 size={22} strokeWidth={1.5} className="text-secondary" aria-label={`${partner.name} logo placeholder`} />
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
      <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5">
        {partner.description}
      </p>
      <div className="flex items-center gap-4 mt-auto">
        {partner.linkedinUrl && (
          <a
            href={partner.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${partner.name} on LinkedIn`}
            className="p-2 -m-2 text-secondary hover:text-accent transition-colors"
          >
            <FaLinkedin size={18} />
          </a>
        )}
        {partner.instagramUrl && (
          <a
            href={partner.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${partner.name} on Instagram`}
            className="p-2 -m-2 text-secondary hover:text-accent transition-colors"
          >
            <FaInstagram size={18} />
          </a>
        )}
      </div>
    </div>
  );
}
