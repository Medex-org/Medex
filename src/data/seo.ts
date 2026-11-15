import seoRoutes from "./seo.json";

export interface SeoEntry {
  key: string;
  path: string | null;
  title: string;
  description: string;
  brandSuffix?: boolean;
}

export const SEO_ROUTES = seoRoutes as SeoEntry[];

/**
 * Per-page title/description, keyed for direct use in <PageMeta {...SEO.about} />.
 * Also the single source of truth consumed by scripts/generate-static-meta.mjs
 * (via seo.json directly) to stamp real per-route HTML for social crawlers,
 * which - unlike PageMeta's useEffect - don't execute JS.
 */
export const SEO: Record<string, Pick<SeoEntry, "title" | "description" | "brandSuffix">> = Object.fromEntries(
  SEO_ROUTES.map(({ key, title, description, brandSuffix }) => [key, { title, description, brandSuffix }]),
);
