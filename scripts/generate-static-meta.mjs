// Post-build step: stamps a real per-route index.html for every path in
// src/data/seo.json, using dist/public/index.html as the template.
//
// Why this exists: the site is a client-rendered SPA (wouter), so every
// route resolves to the same index.html and PageMeta only patches
// document.title/meta tags after React mounts. Social crawlers (WhatsApp,
// LinkedIn, Instagram) fetch the URL and read tags out of the raw HTML
// without executing JS, so they always saw the homepage's title/description/
// og:image regardless of which page was actually shared. This script makes
// each route's HTML self-describing at the file level, so link previews are
// correct without needing a JS-rendering crawler or a server-side framework.
//
// It also emits sitemap.xml and a noindex 404.html so the SEO surface stays
// in sync with src/data/seo.json instead of drifting as a hand-edited file.
//
// Static hosts (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3+CloudFront,
// nginx with try_files) all resolve a request for "/about" to "/about/index.html"
// automatically when that file exists - that's the same mechanism this script
// relies on, no host-specific config required.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DIST_DIR = path.join(ROOT, "dist", "public");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");
const SEO_PATH = path.join(ROOT, "src", "data", "seo.json");
const SITE_URL = "https://medxred.org";
const SITE_NAME = "MEDX R&Ed";

const SEGMENT_LABELS = {
  about: "About",
  team: "Our Team",
  research: "Research",
  education: "Education",
  "medical-exchange": "Medical Exchange",
  technology: "Technology",
  partnerships: "Partnerships",
  "medx-minds": "MEDX Minds",
  events: "Events",
  updates: "News & Updates",
  "city-reps": "City Reps & Ambassadors",
  join: "Join",
};

const SITEMAP_PRIORITIES = {
  "/": "1.0",
  "/join/": "0.9",
  "/about/": "0.8",
  "/education/": "0.8",
  "/medical-exchange/": "0.8",
  "/team/": "0.7",
  "/research/": "0.7",
  "/education/what-is-clinical-research/": "0.7",
  "/education/medical-exchange-guide/": "0.7",
  "/education/global-health-research/": "0.7",
  "/technology/": "0.6",
  "/medx-minds/": "0.6",
  "/partnerships/": "0.6",
  "/events/": "0.5",
  "/updates/": "0.5",
  "/city-reps/": "0.5",
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeXml(str) {
  return escapeHtml(str).replace(/'/g, "&apos;");
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`generate-static-meta: template tag not found for pattern ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

function routeUrl(routePath) {
  return `${SITE_URL}${routePath === "/" ? "/" : routePath}`;
}

function humanizeSegment(segment) {
  return SEGMENT_LABELS[segment]
    ?? segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

function breadcrumbSchema(entry) {
  if (!entry.path || entry.path === "/") return null;

  const segments = entry.path.split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
  ];

  segments.forEach((segment, index) => {
    const isLeaf = index === segments.length - 1;
    const name = isLeaf
      ? (entry.crumb ?? humanizeSegment(segment))
      : humanizeSegment(segment);
    const url = `${SITE_URL}/${segments.slice(0, index + 1).join("/")}/`;
    items.push({
      "@type": "ListItem",
      position: index + 2,
      name,
      item: url,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "MEDX R&ED",
    url: `${SITE_URL}/`,
  };
}

function faqSchema(entry) {
  if (!Array.isArray(entry.faq) || entry.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

function jsonLd(entry) {
  const nodes = [breadcrumbSchema(entry), faqSchema(entry)].filter(Boolean);
  if (nodes.length === 0) nodes.push(websiteSchema());

  const schema =
    nodes.length === 1
      ? nodes[0]
      : {
          "@context": "https://schema.org",
          "@graph": nodes.map(({ "@context": _context, ...node }) => node),
        };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function stampHtml(template, entry) {
  const fullTitle =
    entry.brandSuffix === false || /medx/i.test(entry.title)
      ? entry.title
      : `${entry.title} - ${SITE_NAME}`;
  const title = escapeHtml(fullTitle);
  const description = escapeHtml(entry.description);
  const url = routeUrl(entry.path);

  let html = template;
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceTag(
    html,
    /(<meta name="description" content=")[^"]*(")/,
    `$1${description}$2`,
  );
  html = replaceTag(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = replaceTag(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = replaceTag(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = replaceTag(
    html,
    /(<meta property="og:description" content=")[^"]*(")/,
    `$1${description}$2`,
  );
  html = replaceTag(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);
  html = replaceTag(
    html,
    /(<meta name="twitter:description" content=")[^"]*(")/,
    `$1${description}$2`,
  );
  html = replaceTag(html, /<!-- SEO_JSON_LD -->/, jsonLd(entry));
  return html;
}

function writeSitemap(routes) {
  const lastmod = new Date().toISOString();
  const urls = routes
    .filter((entry) => entry.path)
    .map((entry) => {
      const priority = SITEMAP_PRIORITIES[entry.path] ?? "0.5";
      return [
        "  <url>",
        `    <loc>${escapeXml(routeUrl(entry.path))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.path === "/" || entry.path === "/join/" || entry.path === "/events/" || entry.path === "/updates/" ? "weekly" : "monthly"}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  writeFileSync(path.join(DIST_DIR, "sitemap.xml"), xml);
}

function write404(template) {
  let html = template;
  html = replaceTag(
    html,
    /(<meta name="robots" content=")[^"]*(")/,
    "$1noindex, follow$2",
  );
  html = replaceTag(html, /<!-- SEO_JSON_LD -->/, "");
  writeFileSync(path.join(DIST_DIR, "404.html"), html);
}

function main() {
  const template = readFileSync(TEMPLATE_PATH, "utf8");
  const routes = JSON.parse(readFileSync(SEO_PATH, "utf8"));

  let written = 0;
  for (const entry of routes) {
    if (!entry.path) continue; // e.g. the 404 fallback has no fixed URL to prerender

    const html = stampHtml(template, entry);

    if (entry.path === "/") {
      writeFileSync(TEMPLATE_PATH, html);
    } else {
      const outDir = path.join(DIST_DIR, entry.path.replace(/^\/|\/$/g, ""));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, "index.html"), html);
    }
    written += 1;
  }

  writeSitemap(routes);
  write404(template);

  console.log(
    `generate-static-meta: stamped ${written} route(s), sitemap.xml, and 404.html.`,
  );
}

main();
