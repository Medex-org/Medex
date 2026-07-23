import { useEffect } from "react";

const SITE_NAME = "MEDX R\u0026Ed";

interface PageMetaProps {
  title: string;
  description: string;
}

/**
 * Sets document.title and the meta description for the current page.
 * Lightweight alternative to react-helmet — no extra dependencies needed.
 */
export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    let metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    return () => {
      document.title = `${SITE_NAME} — Medical Exchange, Research \u0026 Education`;
    };
  }, [title, description]);

  return null;
}
