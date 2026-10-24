import {
  Check,
  Code2,
  Database,
  HardDrive,
  KeyRound,
  Rocket,
  Server,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { AdminPageHeader } from "./AdminPageHeader";
import { DEMO_ACCOUNT } from "../demo-data";

const CAN_MANAGE = [
  "Courses and program records",
  "News and updates",
  "Events and opportunities",
  "Approved media assets",
];

const CANNOT_MANAGE = [
  "Website source code",
  "Hosting and domains",
  "Deployment settings",
  "Secrets and credentials",
  "Infrastructure and databases",
  "User accounts and access rules",
];

export function PreferencesPanel() {
  return (
    <>
      <AdminPageHeader
        eyebrow="Account"
        title="Preferences & Access"
        description="An illustrative profile and permission boundary for the future content manager. No authentication or permission enforcement exists in this mockup."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-6">
        <section
          aria-labelledby="sample-account-heading"
          className="border-[1px] border-border bg-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <User
              size={18}
              strokeWidth={1.5}
              className="text-accent"
              aria-hidden="true"
            />
            <h2
              id="sample-account-heading"
              className="font-semibold text-base text-primary"
            >
              Sample account
            </h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-semibold">
              SM
            </div>
            <div className="min-w-0">
              <p className="font-medium">{DEMO_ACCOUNT.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {DEMO_ACCOUNT.role}
              </p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Email
              </dt>
              <dd className="text-muted-foreground break-all">
                {DEMO_ACCOUNT.email}
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Intended role
              </dt>
              <dd className="text-muted-foreground">
                Content manager (illustrative)
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Session
              </dt>
              <dd className="text-muted-foreground">
                Supabase-backed — persists across sessions
              </dd>
            </div>
          </dl>

          <div className="mt-6 pt-5 border-t-[1px] border-border">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              This profile is authenticated through Supabase. Database policies
              should still be reviewed before opening additional admin roles.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="permission-boundary-heading"
          className="border-[1px] border-border bg-card p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck
              size={18}
              strokeWidth={1.5}
              className="text-accent"
              aria-hidden="true"
            />
            <h2
              id="permission-boundary-heading"
              className="font-semibold text-base text-primary"
            >
              Intended permission boundary
            </h2>
          </div>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-6">
            A future editor account should manage public content only. The
            boundaries below are a design intention for a later phase — not
            enforced anywhere in this prototype.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-[1px] border-border bg-background p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
                Can manage content
              </p>
              <ul className="space-y-2">
                {CAN_MANAGE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check
                      size={14}
                      className="text-accent flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-[1px] border-border bg-background p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-secondary mb-3">
                Should not manage
              </p>
              <ul className="space-y-2">
                {CANNOT_MANAGE.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <X
                      size={14}
                      className="text-destructive flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: Code2, label: "Source code" },
              { icon: Server, label: "Hosting" },
              { icon: Rocket, label: "Deployment" },
              { icon: KeyRound, label: "Secrets" },
              { icon: Database, label: "Database" },
              { icon: HardDrive, label: "Storage" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 border-[1px] border-dashed border-border px-3 py-2"
              >
                <Icon
                  size={13}
                  className="text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 border-[1px] border-destructive/30 bg-destructive/5 px-4 py-3">
        <p className="font-sans text-xs text-foreground/80 leading-relaxed">
          <strong className="font-semibold">Mockup only:</strong> no
          authentication, authorization, permission enforcement, audit logging, or
          security controls are active. The dashboard route is not private.
        </p>
      </div>
    </>
  );
}
