import React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaLinkedin, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import medxLogo from "@assets/medx-logo.png";
import medxLogoWebp from "@assets/medx-logo.webp";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchButton } from "@/components/search-button";
import { CommandPalette } from "@/components/command-palette";
import { DEPARTMENTS } from "@/data/departments";
import { LINKS, BRAND } from "@/config/links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
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

  // Lock background scroll while the mobile menu overlay is open.
  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  // Scroll to a #hash target after navigation. Layout is inside each
  // lazy-loaded route, so by the time this effect runs the full page has
  // already committed - but retry a few frames anyway in case the target
  // section isn't laid out yet on the very first frame.
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    let attempts = 0;
    let raf: number;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts += 1;
      if (attempts < 20) raf = requestAnimationFrame(tryScroll);
    };
    tryScroll();
    return () => cancelAnimationFrame(raf);
  }, [location]);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Leadership", href: "/team" },
    { label: "Events", href: "/events" },
    { label: "City Reps", href: "/city-reps" },
  ];

  const isDeptActive = DEPARTMENTS.some((d) => d.href === location);

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
            <picture>
              <source srcSet={medxLogoWebp} type="image/webp" />
              <img
                src={medxLogo}
                alt="MEDX R&Ed"
                width={512}
                height={512}
                className="h-9 w-auto object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <span className="font-bold tracking-wider text-base uppercase text-primary leading-none whitespace-nowrap hidden lg:block">
              MEDX R&amp;Ed
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium whitespace-nowrap" aria-label="Main navigation">
            <Link
              href="/about"
              className={`transition-colors hover:text-accent relative pb-0.5 ${
                location === "/about"
                  ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-accent"
                  : "text-foreground"
              }`}
            >
              About
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center gap-1 outline-none transition-colors hover:text-accent relative pb-0.5 ${
                  isDeptActive
                    ? "text-accent after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-accent"
                    : "text-foreground"
                }`}
              >
                Departments
                <ChevronDown size={14} strokeWidth={2} aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-2">
                {DEPARTMENTS.map((dept) => (
                  <DropdownMenuItem key={dept.href} asChild className="cursor-pointer py-2.5">
                    <Link href={dept.href} className="flex items-start gap-3">
                      <dept.icon size={16} strokeWidth={1.5} className="text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="font-medium text-sm">{dept.shortName}</span>
                        <span className="text-xs text-muted-foreground font-mono">{dept.tagline}</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(1).map((link) => (
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

            <SearchButton onClick={() => setPaletteOpen(true)} />

            <ThemeToggle />

            <Link
              href="/join"
              className="px-5 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors text-xs uppercase tracking-widest font-semibold"
            >
              Join MEDX
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <SearchButton compact onClick={() => setPaletteOpen(true)} />
            <button
              className="p-2.5 -mr-2 text-foreground rounded-sm hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
            className="md:hidden fixed inset-0 z-40 bg-background pt-16 flex flex-col overflow-y-auto"
          >
            <nav className="flex flex-col px-4 sm:px-6 py-8 gap-0" aria-label="Mobile navigation">
              <Link
                href="/about"
                className={`font-sans border-b-[1px] border-border py-5 text-xl ${
                  location === "/about" ? "text-accent" : "text-foreground"
                }`}
              >
                About
              </Link>

              <p className="font-mono text-xs uppercase tracking-widest text-secondary pt-6 pb-2">
                Departments
              </p>
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.href}
                  href={dept.href}
                  className={`font-sans border-b-[1px] border-border py-4 text-lg ${
                    location === dept.href ? "text-accent" : "text-foreground"
                  }`}
                >
                  {dept.shortName}
                </Link>
              ))}

              <div className="pt-4" />
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans border-b-[1px] border-border py-5 text-xl ${
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

      <footer className="border-t-[1px] border-border bg-footer text-footer-foreground mt-auto py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <picture>
                  <source srcSet={medxLogoWebp} type="image/webp" />
                  <img
                    src={medxLogo}
                    alt="MEDX R&Ed"
                    width={512}
                    height={512}
                    className="h-10 w-auto object-contain brightness-0 invert"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <span className="font-bold tracking-wider text-lg uppercase">
                  MEDX R&amp;Ed
                </span>
              </div>
              <p className="font-sans italic text-footer-foreground/70 text-sm leading-relaxed max-w-xs">
                &ldquo;{BRAND.motto}&rdquo;
              </p>
              <p className="font-mono text-xs text-footer-foreground/60 uppercase tracking-widest mt-4">
                {BRAND.mottoTagline}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-footer-foreground/50 mb-4">
                Departments
              </p>
              <ul className="space-y-2">
                {DEPARTMENTS.map((dept) => (
                  <li key={dept.href}>
                    <Link
                      href={dept.href}
                      className="block py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                    >
                      {dept.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-footer-foreground/50 mb-4">
                Connect
              </p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={LINKS.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                  >
                    <FaLinkedin size={14} aria-hidden="true" /> LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                  >
                    <FaInstagram size={14} aria-hidden="true" /> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.social.whatsappCommunity}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                  >
                    <FaWhatsapp size={14} aria-hidden="true" /> WhatsApp Community
                  </a>
                </li>
                <li>
                  <a
                    href={LINKS.social.whatsappChannel}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                  >
                    <FaWhatsapp size={14} aria-hidden="true" /> WhatsApp Channel
                  </a>
                </li>
                <li>
                  <Link
                    href="/join"
                    className="block py-1.5 -my-1.5 text-sm text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                  >
                    Join MEDX
                  </Link>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t-[1px] border-footer-foreground/10">
                <a
                  href={`mailto:${LINKS.email}`}
                  className="text-xs text-footer-foreground/60 font-mono hover:text-footer-foreground/70 transition-colors"
                >
                  {LINKS.email}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-footer-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-xs font-mono text-footer-foreground/60 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} MEDX R&amp;Ed. All rights reserved.
            </p>
            <p className="text-xs font-sans italic text-footer-foreground/60">
              A student-led platform, for students.
            </p>
          </div>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
