import { Layout } from "@/components/layout";
import { PageMeta } from "@/components/ui/page-meta";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <PageMeta
        title="404 - Page Not Found"
        description="The page you are looking for does not exist in the MEDX R&Ed archives."
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-32 text-center">
        {/* Decorative rule */}
        <div className="w-12 h-[1px] bg-accent mx-auto mb-12" aria-hidden="true" />

        <p className="font-mono text-xs uppercase tracking-[0.25em] text-secondary mb-6">
          Error 404
        </p>
        <h1 className="font-mono text-[8rem] md:text-[12rem] leading-none font-semibold text-muted/60 tracking-tighter mb-0 select-none" aria-hidden="true">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6 -mt-4">
          Page Not Found
        </h2>
        <p className="font-serif text-lg text-secondary max-w-md mx-auto mb-12 leading-relaxed">
          The scholarly record you are looking for does not exist in our archives.
          It may have been moved, renamed, or never written.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold tracking-widest uppercase text-xs hover:bg-primary/90 transition-colors flex items-center gap-2 group"
          >
            Return Home{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/about"
            className="px-8 py-4 border-[1px] border-border text-foreground font-semibold tracking-widest uppercase text-xs hover:bg-muted transition-colors"
          >
            About MEDX
          </Link>
        </div>

        <div className="w-12 h-[1px] bg-border mx-auto mt-16" aria-hidden="true" />
      </div>
    </Layout>
  );
}
