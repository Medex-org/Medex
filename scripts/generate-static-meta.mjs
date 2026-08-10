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
const SITE_URL = "https://medxresearch.org";
const SITE_NAME = "MEDX R&Ed";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`generate-static-meta: template tag not found for pattern ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

function stampHtml(template, entry) {
  const fullTitle = entry.title.includes(SITE_NAME) ? entry.title : `${entry.title} - ${SITE_NAME}`;
  const title = escapeHtml(fullTitle);
  const description = escapeHtml(entry.description);
  const url = `${SITE_URL}${entry.path === "/" ? "/" : entry.path}`;

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
  return html;
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
      const outDir = path.join(DIST_DIR, entry.path.replace(/^\//, ""));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(path.join(outDir, "index.html"), html);
    }
    written += 1;
  }

  console.log(`generate-static-meta: stamped ${written} route(s) with per-page meta tags.`);
}

main();
