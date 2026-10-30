import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { mediaUrl } from "@/lib/media-url";

const medxLogo = mediaUrl("medx-logo.png");
const medxLogoWebp = mediaUrl("medx-logo.webp");
import { ThemeToggle } from "@/components/theme-toggle";
import type { AdminSection } from "./admin-types";
import { useAdminStore } from "./use-admin-store";
import { useAuth } from "./auth/AuthProvider";
import { DemoModeNotice } from "./components/DemoModeNotice";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "news", label: "News & Updates", icon: Newspaper },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "media", label: "Media Library", icon: Images },
  { id: "achievements", label: "Achievements", icon: LayoutDashboard },
  { id: "news-highlights", label: "News Highlights", icon: Newspaper },
  { id: "webinars", label: "Webinars", icon: CalendarDays },
  { id: "banners", label: "Banners", icon: Images },
  { id: "partners", label: "Partners", icon: ShieldCheck },
  { id: "officers", label: "Global Officers", icon: Users },
  { id: "preferences", label: "Preferences & Access", icon: ShieldCheck },
];

const SECTION_LABELS: Record<AdminSection, string> = {
  overview: "Overview",
  courses: "Courses",
  news: "News & Updates",
  events: "Events",
  media: "Media Library",
  achievements: "Achievements",
  "news-highlights": "News Highlights",
  webinars: "Webinars",
  banners: "Banners",
  partners: "Partners",
  officers: "Global Officers",
  preferences: "Preferences & Access",
};

export function AdminLayout({
  section,
  onSectionChange,
  children,
}: {
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const store = useAdminStore();
  const { profile, user, signOut } = useAuth();

  const counts: Partial<Record<AdminSection, number>> = {
    courses: store.courses.length,
    news: store.news.length,
    events: store.events.length,
    media: store.media.length,
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [section]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const navList = (
    <nav aria-label="Dashboard sections" className="space-y-1">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = section === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSectionChange(id)}
            aria-current={active ? "page" : undefined}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
              active
                ? "bg-accent/10 text-accent border-l-2 border-accent"
                : "text-foreground/75 hover:bg-muted border-l-2 border-transparent"
            }`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
              <span className="truncate">{label}</span>
            </span>
            {typeof counts[id] === "number" ? (
              <span className="font-mono text-[10px] text-muted-foreground">
                {counts[id]}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans">
      <div className="lg:flex">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r-[1px] border-border bg-card">
          <div className="px-5 py-5 border-b-[1px] border-border">
            <Link href="/" className="flex items-center gap-3">
              <picture>
                <source srcSet={medxLogoWebp} type="image/webp" />
                <img
                  src={medxLogo}
                  alt="MEDX R&Ed"
                  width={512}
                  height={512}
                  className="h-9 w-auto object-contain"
                  decoding="async"
                />
              </picture>
              <div>
                <p className="font-bold tracking-wider text-sm uppercase text-primary leading-none">
                  MEDX R&amp;Ed
                </p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mt-1">
                  Admin preview
                </p>
              </div>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2">
              Content
            </p>
            {navList}
          </div>

          <div className="border-t-[1px] border-border px-4 py-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-xs font-semibold">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{profile?.full_name || user?.email || 'Admin'}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                  {profile?.role || 'admin'}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors"
            >
              <LogOut size={13} aria-hidden="true" /> Sign out
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors"
            >
              <ExternalLink size={13} aria-hidden="true" /> View public site
            </Link>
          </div>
        </aside>

        <div className="flex-1 min-w-0 lg:pl-64">
          <header className="sticky top-0 z-30 border-b-[1px] border-border bg-background/95 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 h-16">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="lg:hidden p-2 -ml-2 text-foreground hover:bg-muted rounded-sm transition-colors"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open dashboard navigation"
                  aria-expanded={menuOpen}
                  aria-controls="admin-mobile-menu"
                >
                  <Menu size={22} />
                </button>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                    MEDX Admin
                  </p>
                  <h2 className="text-sm font-semibold text-primary truncate">
                    {SECTION_LABELS[section]}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center border-[1px] border-dashed border-accent/40 bg-accent/5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Live content
                </span>
                <ThemeToggle />
                <Link
                  href="/"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 border-[1px] border-border text-xs font-medium hover:border-accent/40 hover:text-accent transition-colors"
                >
                  Public site <ExternalLink size={12} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </header>

          <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
            <DemoModeNotice />
            <div className="mt-6">{children}</div>
          </main>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="admin-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation"
          className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden"
        >
          <div className="h-16 flex items-center justify-between px-4 border-b-[1px] border-border">
            <div className="flex items-center gap-2">
              <img
                src={medxLogo}
                alt="MEDX R&Ed"
                width={512}
                height={512}
                className="h-8 w-auto object-contain"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Admin preview
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="p-2 -mr-2 hover:bg-muted rounded-sm transition-colors"
              aria-label="Close dashboard navigation"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {navList}
            <div className="mt-6 pt-6 border-t-[1px] border-border px-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Admin account
              </p>
              <p className="text-sm font-medium truncate">{profile?.full_name || user?.email || 'Admin'}</p>
              <button
                onClick={() => signOut()}
                className="mt-3 inline-flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors"
              >
                <LogOut size={13} aria-hidden="true" /> Sign out
              </button>
              <Link
                href="/"
                className="mt-2 inline-flex items-center gap-2 text-xs text-secondary hover:text-accent transition-colors"
              >
                <ExternalLink size={13} aria-hidden="true" /> View public site
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
