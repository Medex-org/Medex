import { useState } from "react";
import { User, UserPlus, ArrowRight } from "lucide-react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { ApplicationDialog } from "@/components/shared/application-dialog";
import { ShareActions } from "@/components/shared/share-actions";
import { slugify } from "@/lib/share";

export interface HierarchyPerson {
  name: string;
  role: string;
  image: string | null;
  intro?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  /** Renders an "Open Position" card with an Apply Now CTA instead of a person. */
  vacant?: boolean;
}

/**
 * Card is deliberately built with explicit foreground/muted-foreground text
 * colors on the card background token (both defined as a matched, always-
 * legible pair in light and dark) to guarantee contrast.
 */
export function HierarchyCard({
  person,
  featured = false,
  anchor,
  applicationDepartment,
}: {
  person: HierarchyPerson;
  featured?: boolean;
  anchor?: string;
  applicationDepartment?: string;
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const image = person.image && failedImage !== person.image ? person.image : null;
  const cardAnchor =
    anchor ||
    `person-${slugify(person.name)}-${slugify(person.role)}${
      applicationDepartment ? `-${slugify(applicationDepartment)}` : ""
    }`;

  if (person.vacant) {
    return (
      <div
        id={cardAnchor}
        className={`scroll-mt-32 p-6 border-[1px] border-dashed border-accent/30 bg-accent/5 text-card-foreground flex flex-col items-center text-center h-full ${
          featured ? "sm:p-8" : ""
        }`}
      >
        <div
          className={`rounded-full border-[1px] border-dashed border-accent/40 bg-accent/10 mb-5 flex items-center justify-center flex-shrink-0 ${
            featured ? "w-32 h-32" : "w-24 h-24"
          }`}
        >
          <UserPlus size={featured ? 32 : 24} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">Open Position</p>
        <h3 className={`font-bold ${featured ? "text-xl" : "text-base"} text-card-foreground mb-4`}>
          {person.role}
        </h3>
        <ApplicationDialog
          trigger={
            <button
              type="button"
              className="mt-auto inline-flex items-center gap-1.5 px-4 py-3 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest hover:bg-accent/90 transition-colors"
            >
              Apply for this role <ArrowRight size={12} aria-hidden="true" />
            </button>
          }
          defaultPosition={person.role}
          defaultDepartment={applicationDepartment}
          title={`Apply for ${person.role}`}
          description="Submit your application directly to the MEDX admin dashboard."
        />
        <ShareActions
          title={person.role}
          anchor={cardAnchor}
          caption={`Open position at MEDX: ${person.role}`}
          className="mt-3 justify-center"
        />
      </div>
    );
  }

  return (
    <div
      id={cardAnchor}
      className={`scroll-mt-32 p-6 border-[1px] border-border bg-card text-card-foreground flex flex-col items-center text-center h-full ${
        featured ? "sm:p-8" : ""
      }`}
    >
      <div
        className={`rounded-full overflow-hidden border-[1px] border-border bg-muted mb-5 flex-shrink-0 ${
          featured ? "w-36 h-36" : "w-28 h-28"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            loading="lazy"
            decoding="async"
            onError={() => setFailedImage(person.image)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
            <User size={featured ? 36 : 28} strokeWidth={1} />
          </div>
        )}
      </div>
      <h3 className={`font-bold ${featured ? "text-xl" : "text-base"} text-card-foreground mb-1`}>
        {person.name}
      </h3>
      <p className="font-mono text-xs uppercase tracking-widest text-accent mb-3">{person.role}</p>
      {person.intro && (
        <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">{person.intro}</p>
      )}
      <div className="mt-auto w-full pt-3">
        {(person.linkedinUrl || person.instagramUrl) && (
          <div className="flex items-center justify-center gap-3 pb-2">
            {person.linkedinUrl && (
              <a
                href={person.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name} on LinkedIn`}
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaLinkedin size={16} />
              </a>
            )}
            {person.instagramUrl && (
              <a
                href={person.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${person.name} on Instagram`}
                className="text-secondary hover:text-accent transition-colors"
              >
                <FaInstagram size={16} />
              </a>
            )}
          </div>
        )}
        <ShareActions
          title={`${person.name} — ${person.role}`}
          anchor={cardAnchor}
          caption={`${person.name} — ${person.role} at MEDX`}
          image={person.image}
          className="justify-center"
        />
      </div>
    </div>
  );
}
