import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LINKS } from "@/config/links";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";

const TIERS = ["Only LTE Mentorship", "LTE Lectures + Mentorship"] as const;

/**
 * LTE cohort enrollment flow. MEDX has no online payment processor connected
 * to this site, so this intentionally does NOT collect card details - that
 * would look like real payment processing without being one. Instead it
 * captures the request and opens a pre-filled email so MEDX can send secure
 * payment instructions and confirm the seat manually.
 */
export function LteEnrollment() {
  const [tier, setTier] = React.useState<(typeof TIERS)[number]>(TIERS[0]);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [requested, setRequested] = React.useState(false);

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const subject = `LTE Mentorship Enrollment Request - ${tier}`;
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nSelected Tier: ${tier}\nLeads: Sasha Zaki, Bisma Bashir`,
    );
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setRequested(true);
  }

  return (
    <div className="p-8 border-[1px] border-border bg-card">
      <p className="font-mono text-xs uppercase tracking-widest text-secondary mb-1">Cohort Leads</p>
      <p className="font-sans text-sm text-muted-foreground mb-6">Sasha Zaki &amp; Bisma Bashir</p>

      {requested ? (
        <div className="py-6 text-center">
          <CheckCircle2 size={28} className="text-accent mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
          <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Your enrollment request for <strong className="text-foreground">{tier}</strong> has been composed as an
            email. Send it to complete your request - MEDX will follow up by email with secure payment
            instructions and confirm your seat once payment is received.
          </p>
        </div>
      ) : (
        <form onSubmit={handleRequest} className="space-y-6">
          <div>
            <Label className="text-xs uppercase tracking-widest font-mono text-secondary mb-3 block">
              Select a Tier
            </Label>
            <RadioGroup
              value={tier}
              onValueChange={(v) => setTier(v as (typeof TIERS)[number])}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {TIERS.map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-3 p-4 border-[1px] cursor-pointer transition-colors ${
                    tier === t ? "border-accent bg-accent/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value={t} id={t} />
                  <span className="text-sm font-medium">{t}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lte-name" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Full Name
              </Label>
              <Input id="lte-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lte-email" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Email
              </Label>
              <Input id="lte-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors"
            >
              <Mail size={13} aria-hidden="true" /> Request Enrollment
            </button>
            <a
              href={LINKS.menteeForm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-[1px] border-border font-semibold tracking-widest uppercase text-xs hover:bg-muted transition-colors"
            >
              Or Apply via Mentee Form <ArrowRight size={13} aria-hidden="true" />
            </a>
          </div>
          <p className="text-xs font-sans italic text-muted-foreground">
            No online payment is processed on this site. Requesting enrollment sends MEDX a pre-filled email;
            secure payment instructions follow directly from the team.
          </p>
        </form>
      )}
    </div>
  );
}
