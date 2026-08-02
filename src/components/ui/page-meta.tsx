import { useEffect } from "react";

const SITE_NAME = "MEDX R&Ed";
const DEFAULT_TITLE = `${SITE_NAME} - Medical Exchange, Research & Education`;
const DEFAULT_DESCRIPTION =
  "A global community of medical and health-science students united by rigorous methodology, cross-border mentorship, and the pursuit of evidence-based medicine.";

interface PageMetaProps {
  title: string;
  description: string;
}

function setMetaByAttr(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Sets document.title, meta description, and OG/Twitter tags for the current
 * page client-side. This keeps the SPA's own document consistent when users
 * navigate between routes, but social crawlers (WhatsApp/LinkedIn/Instagram)
 * don't execute JS - the per-route static HTML stamped by
 * scripts/generate-static-meta.mjs at build time is what they actually see.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaByAttr("name", "description", description);
    setMetaByAttr("property", "og:title", fullTitle);
    setMetaByAttr("property", "og:description", description);
    setMetaByAttr("name", "twitter:title", fullTitle);
    setMetaByAttr("name", "twitter:description", description);

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaByAttr("name", "description", DEFAULT_DESCRIPTION);
      setMetaByAttr("property", "og:title", DEFAULT_TITLE);
      setMetaByAttr("property", "og:description", DEFAULT_DESCRIPTION);
      setMetaByAttr("name", "twitter:title", DEFAULT_TITLE);
      setMetaByAttr("name", "twitter:description", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);

  return null;
}
