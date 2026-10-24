# MEDX Admin Dashboard — Implementation Plan

Status: Supabase-backed implementation in progress. Authentication, database
CRUD, remote media URLs, and published public-content reads are connected.

## 1. Repository discovery

| Area | Finding |
| --- | --- |
| Framework | React 18, TypeScript, Vite 6, Tailwind CSS v4 |
| Routing | `wouter` + `<Switch>` in `src/App.tsx`; all pages lazy-loaded; `NotFound` last |
| Styling | Tailwind v4 tokens in `src/index.css`; navy primary, maroon accent, cream background |
| Typography | `Inter` sans, `Lora` serif headings, `JetBrains Mono` labels |
| UI primitives | Radix-based `src/components/ui/*` (button, card, table, dialog, alert-dialog, select, input, textarea, badge, tabs, empty) |
| Feedback | Existing `useToast` hook + `src/components/ui/toaster.tsx` (already mounted in `App.tsx`) |
| Theme | `next-themes` via `src/components/theme-provider.tsx` and `ThemeToggle` |
| Branding | Logo assets in `assets/medx-logo.{png,webp}` imported through the `@assets` alias |
| Data | Public content is mostly hardcoded in page files (`events.tsx`, `home.tsx`, `departments/technology.tsx`); shared entities live in `src/data/*` |
| Docs/tests | No README, AGENTS.md, docs directory, lint script, or test suite exists |

Relevant public sources inspected:

- `src/pages/events.tsx` — local event list, categories, status badges.
- `src/pages/home.tsx` — achievements, news highlights, webinars, stats.
- `src/pages/departments/technology.tsx` — sample LMS course tracking.
- `src/pages/departments/research.tsx` and `education.tsx` — program categories
  (SRMA, LTE, clinical skills, licensing pathways).
- `src/data/partners.ts`, `governance.ts`, `regional-leadership.ts` — shared data style.
- `src/components/ui/*` — component APIs reused by the dashboard.
- `scripts/generate-static-meta.mjs` — build-time per-route meta stamping.

## 2. Route and component structure

The dashboard is a single, standalone route:

```
/admin → src/admin/AdminDashboard.tsx
```

- Added to `src/App.tsx` immediately before the `NotFound` route.
- Not linked from the public header, footer, or any public page.
- Uses its own `AdminLayout` shell (sidebar + top bar), not the public `Layout`,
  so public navigation/footer are not mixed into the admin experience.
- `/admin` is registered in both development and production builds per the
  project owner's decision. It is intentionally unlinked and marked `noindex`.
  This is convenience only and provides **no security**.
- Internal sections are client-side state (`overview | courses | news | events |
  media | preferences`), so section changes never hit the network or reload the
  page.

Component tree:

```
AdminDashboard
├─ AdminStoreProvider (Supabase-backed state)
├─ PageMeta (noindex, nofollow)
└─ AdminLayout
   ├─ sidebar navigation + demo badge + sample account
   ├─ mobile navigation overlay
   ├─ DemoModeNotice
   └─ active section
      ├─ AdminOverview
      ├─ CoursesManager
      ├─ NewsManager
      ├─ EventsManager
      ├─ MediaLibrary
      └─ PreferencesPanel
```

Shared components:

- `AdminPageHeader` — section label, title, description, primary action.
- `ContentStatusBadge` — Draft / Published text labels using existing badge classes.
- `AdminFormDialog` — accessible Radix dialog wrapper with a native form footer.
- `ConfirmDeleteDialog` — Radix alert dialog for destructive actions.
- `AdminField` — labelled form field with inline validation message.
- `AdminEmptyState` — reusable empty result state.
- `DemoMediaPicker` — select bundled sample media or preview a local file.

## 3. Screens and interactions

### Overview
- Welcome heading and demo-mode explanation.
- Summary cards: courses, news/updates, events, media assets.
- Recent content across all three content types, sorted by last updated, with
  edit actions that open the relevant editor.
- Upcoming events using sample dates.
- Quick actions: add course, create update, create event.

### Courses
- Search by title/description, filter by status and category.
- Table on `md+`, stacked cards on mobile.
- Columns: title, category, start date, status, last updated, actions.
- Create/edit dialog fields: title, category, description, start date, cover
  image (sample media), registration URL, status.
- Draft/Published toggle per item.
- Delete requires confirmation.

### News & Updates
- Search and status/category filters.
- Columns: title, category, date, status, last updated, actions.
- Form fields: title, category, body, date, image, status.
- Draft/Published toggle and confirmed deletion.

### Events
- Search and status/category filters.
- Columns: title, date/time/time zone, location mode, status, actions.
- Form fields: title, category, date, time, time zone, location mode, location,
  description, registration URL, image, status.
- Draft/Published toggle and confirmed deletion.

### Media Library
- Searchable grid of sample assets with preview, filename, type, size, and
  “used in” references.
- Simulated local file picker using `URL.createObjectURL` for preview only.
  Nothing is uploaded or persisted.
- Remove requires confirmation; local object URLs are revoked.

### Preferences / Access Overview
- Clearly labelled sample account (not a login).
- Illustrative permission boundary: may manage courses, updates, events, and
  approved media; may not manage source code, hosting, deployment, secrets,
  infrastructure, or user accounts.
- Explicit statement that no authentication, permission enforcement, or security
  controls exist in this mockup.

## 4. Demo data and state

- `src/admin/demo-data.ts` holds fictional sample content only, worded to avoid
  unverified claims about real MEDX programs, dates, or opportunities.
- `src/admin/admin-types.ts` defines content/media types and form input types.
- `src/admin/use-admin-store.tsx` provides an in-memory React context reducer
  with create, update, delete, and status-toggle operations for each content
  type, plus media add/remove.
- Courses, news, events, media, homepage sections, and partners are stored in
  Supabase. “Published” records are read by the public content hook.
- Media previews use only bundled assets or browser object URLs. No files leave
  the browser.

## 5. Separation from the public site

- No public page or shared public data file is modified except:
  - `src/App.tsx` — one new lazy route registered before the 404 route.
  - `src/components/ui/page-meta.tsx` — optional `noindex` prop; existing public
    usages are unchanged.
- The dashboard does not render the public header/footer.
- The dashboard is absent from public navigation.
- `/admin` sets `robots: noindex, nofollow` for its lifetime.
- No deployment, hosting, DNS, workflow, or build configuration changes.

## 6. Checks and risks

Checks:

1. `npm install` (dependencies were not installed in the working copy).
2. `npm run typecheck`.
3. `npm run build` (also runs the static-meta generation script).
4. Manual smoke test of `/admin` and representative public routes in dev.

There is no lint script or test suite in this repository, so none can be run.

Risks and limitations:

- **Database setup:** run `supabase/migrations/001_site_content.sql` in the
  Supabase SQL editor before using the five migrated homepage sections.
- **Media migration:** existing uploaded media records need to be mapped to
  `image_path` values when their bucket paths are known.
- **Security:** enable RLS and review policies before treating the admin as
  production-ready.
- **SPA hosting:** a static host without SPA fallback may 404 on direct `/admin`
  navigation; dev server and standard SPA hosts are unaffected.
- **No backend contracts:** sample fields are provisional until the content
  schema is designed in a later phase.

## 7. Explicitly out of scope

Database, Supabase, CMS provider, authentication, authorization enforcement,
API routes, secrets, file storage, migrations, deployment changes, and real
publishing. Not started unless separately requested.
