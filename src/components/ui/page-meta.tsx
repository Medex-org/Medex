import { useEffect } from "react";

const SITE_NAME = "MEDX R&Ed";
const SITE_URL = "https://medxred.org";
const DEFAULT_TITLE = `${SITE_NAME} | Clinical Research & Medical Education`;
const DEFAULT_DESCRIPTION =
  "MEDX R&Ed advances clinical research education, medical exchange, and technology for global health. Join our global student-led mission.";

interface PageMetaProps {
  title: string;
  description: string;
  noindex?: boolean;
  brandSuffix?: boolean;
}

const BRAND_PATTERN = /medx/i;

function setMetaByAttr(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setRobots(content: string) {
  setMetaByAttr("name", "robots", content);
}

function canonicalPath() {
  if (typeof window === "undefined") return "/";
  const pathname = window.location.pathname.replace(/\/+$/, "");
  return `${pathname || ""}/`;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Sets document.title, meta description, and OG/Twitter tags for the current
 * page client-side. This keeps the SPA's own document consistent when users
 * navigate between routes, but social crawlers (WhatsApp/LinkedIn/Instagram)
 * don't execute JS - the per-route static HTML stamped by
 * scripts/generate-static-meta.mjs at build time is what they actually see.
 */
export function PageMeta({ title, description, noindex = false, brandSuffix = true }: PageMetaProps) {
  useEffect(() => {
    const fullTitle =
      !brandSuffix || BRAND_PATTERN.test(title) ? title : `${title} - ${SITE_NAME}`;
    document.title = fullTitle;

    setMetaByAttr("name", "description", description);
    setMetaByAttr("property", "og:title", fullTitle);
    setMetaByAttr("property", "og:description", description);
    setMetaByAttr("name", "twitter:title", fullTitle);
    setMetaByAttr("name", "twitter:description", description);
    setRobots(noindex ? "noindex, nofollow" : "index, follow");

    const canonical = `${SITE_URL}${canonicalPath()}`;
    setCanonical(canonical);
    setMetaByAttr("property", "og:url", canonical);

    return () => {
      document.title = DEFAULT_TITLE;
      setMetaByAttr("name", "description", DEFAULT_DESCRIPTION);
      setMetaByAttr("property", "og:title", DEFAULT_TITLE);
      setMetaByAttr("property", "og:description", DEFAULT_DESCRIPTION);
      setMetaByAttr("name", "twitter:title", DEFAULT_TITLE);
      setMetaByAttr("name", "twitter:description", DEFAULT_DESCRIPTION);
      setRobots("index, follow");
      setCanonical(`${SITE_URL}/`);
      setMetaByAttr("property", "og:url", `${SITE_URL}/`);
    };
  }, [title, description, noindex, brandSuffix]);

  return null;
}
