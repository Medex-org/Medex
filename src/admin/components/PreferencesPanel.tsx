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
import { AccessManager } from "./AccessManager";
import { useAuth } from "../auth/AuthProvider";

const CAN_MANAGE = [
  "Courses, news, events, and public content",
  "Department team rosters",
  "Approved media assets",
  "Admin roles and department assignments",
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
  const { user, profile } = useAuth();
  const name = profile?.full_name || user?.email || "Signed-in admin";
  const email = profile?.email || user?.email || "—";
  const role = profile?.role || "admin";
  const roleLabel = profile?.department_slug ? `${role} · ${profile.department_slug}` : role;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AD";
  const build = __BUILD_VERSION__ === "dev" ? "dev" : __BUILD_VERSION__.slice(0, 7);

  return (
    <>
      <AdminPageHeader
        eyebrow="Account"
        title="Preferences & Access"
        description="Your Supabase account and the current permission boundary for content editors."
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
              Signed-in account
            </h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-sm font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-medium">{name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                {roleLabel}
              </p>
            </div>
          </div>

          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Email
              </dt>
              <dd className="text-muted-foreground break-all">{email}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Role
              </dt>
              <dd className="text-muted-foreground">{roleLabel}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Session
              </dt>
              <dd className="text-muted-foreground">
                Supabase-backed — persists across sessions
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-secondary">
                Build
              </dt>
              <dd className="text-muted-foreground font-mono text-xs">{build}</dd>
            </div>
          </dl>

          <div className="mt-6 pt-5 border-t-[1px] border-border">
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Admin routes require a profile with a super admin, department admin,
              or content editor role. Database policies enforce the same scope.
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
            Super admins manage all content and access. Department admins manage
            their department team and media. Content editors manage public content.
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

      <AccessManager />

      <div className="mt-6 border-[1px] border-accent/30 bg-accent/5 px-4 py-3">
        <p className="font-sans text-xs text-foreground/80 leading-relaxed">
          <strong className="font-semibold">Access:</strong> the dashboard requires a
          Supabase account with a super admin, department admin, or content editor role.
          Department admins can only manage their assigned department team and media.
        </p>
      </div>
    </>
  );
}
