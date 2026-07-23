import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import medxLogo from "@assets/medx-logo.png";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [location] = useLocation();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Programs", href: "/programs" },
    { label: "MEDX Minds", href: "/medx-minds" },
    { label: "Events", href: "/events" },
    { label: "City Reps", href: "/city-reps" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-accent selection:text-white font-sans">
      <header
        className={`sticky top-0 z-50 w-full border-b-[1px] border-border transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-background/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={medxLogo}
              alt="MEDX R&Ed"
              className="h-9 w-auto object-contain"
            />
            <span className="font-bold tracking-wider text-base uppercase text-primary leading-none hidden sm:block">
              MEDX R&amp;Ed
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-accent relative pb-0.5 ${
                  location === link.href
                    ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-accent"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/join"
              className="px-5 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-xs uppercase tracking-widest font-semibold"
            >
              Join MEDX
            </Link>
          </nav>

          <button
            className="md:hidden p-2 -mr-2 text-foreground rounded-sm hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-40 bg-background pt-16 flex flex-col"
          >
            <nav className="flex flex-col px-4 sm:px-6 py-8 gap-0" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-serif italic border-b-[1px] border-border py-5 text-xl ${
                    location === link.href ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/join"
                className="mt-8 px-6 py-4 bg-accent text-accent-foreground text-center font-sans uppercase tracking-widest text-sm font-semibold"
              >
                Join MEDX
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">{children}</main>

      <footer className="border-t-[1px] border-border bg-primary text-primary-foreground mt-auto py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={medxLogo}
                  alt="MEDX R&Ed"
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <span className="font-bold tracking-wider text-lg uppercase">
                  MEDX R&amp;Ed
                </span>
              </div>
              <p className="font-serif italic text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
                "Together, We Turn Curiosity into Discovery"
              </p>
              <p className="font-mono text-xs text-primary-foreground/40 uppercase tracking-widest mt-4">
                Research · Education · Development
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">
                Navigate
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "About", href: "/about" },
                  { label: "Team", href: "/team" },
                  { label: "Programs", href: "/programs" },
                  { label: "Events", href: "/events" },
                  { label: "City Representatives", href: "/city-reps" },
                  { label: "MEDX Minds", href: "/medx-minds" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://www.linkedin.com/company/medx-medical-exchange-research-and-education"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/medxresearch_education"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://forms.gle/yJzGnk4DwmWysygv9"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    Join MEDX
                  </a>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t-[1px] border-primary-foreground/10">
                <a
                  href="mailto:connect@medx.org"
                  className="text-xs text-primary-foreground/40 font-mono hover:text-primary-foreground/70 transition-colors"
                >
                  connect@medx.org
                </a>
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-xs font-mono text-primary-foreground/30 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MEDX R&amp;Ed. All rights reserved.
            </p>
            <p className="text-xs font-serif italic text-primary-foreground/30">
              A student-led platform, for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
