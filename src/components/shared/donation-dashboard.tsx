import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SimpleApplicationModal } from "@/components/shared/simple-application-modal";
import { HeartHandshake, Trophy, FlaskConical, Users } from "lucide-react";

export function DonationDashboard() {
  return (
    <Tabs defaultValue="donor" className="w-full">
      <TabsList className="mb-8 h-11">
        <TabsTrigger value="donor">Donor View</TabsTrigger>
        <TabsTrigger value="member">Member View</TabsTrigger>
      </TabsList>

      {/* ── Donor View: public transparency board ──────────────────────── */}
      <TabsContent value="donor" className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 md:p-8 border-[1px] border-border bg-card">
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={18} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-secondary">
                Donor Leaderboard
              </h3>
            </div>
            <div className="py-10 text-center border-[1px] border-dashed border-border">
              <p className="font-sans text-muted-foreground text-sm max-w-xs mx-auto">
                No donations recorded yet. Be the first name on this board.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 border-[1px] border-border bg-card flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <HeartHandshake size={18} className="text-accent" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-secondary">
                Support Student Research
              </h3>
            </div>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6 flex-grow">
              Every contribution funds LMS infrastructure, research tools, and publication grants
              for students who can't otherwise afford mentorship fees. MEDX does not yet process
              payments online - pledges are coordinated directly by email.
            </p>
            <SimpleApplicationModal
              trigger={
                <button className="inline-flex w-full items-center justify-center gap-2 whitespace-normal px-6 py-3 text-center bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors">
                  Donate to Support Student Research
                </button>
              }
              title="Donate to Support Student Research"
              description="Tell us a bit about your intended contribution - the MEDX team will follow up directly to coordinate."
              subject="MEDX Research Donation Pledge"
              submitLabel="Compose Pledge Email"
              fields={[
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "amount", label: "Intended Contribution", placeholder: "e.g. $50" },
                {
                  name: "project",
                  label: "Project of Interest",
                  placeholder: "e.g. SRMA Project-1, general fund",
                },
                { name: "message", label: "Message (optional)", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </TabsContent>

      {/* ── Member View: internal contribution tracking ────────────────── */}
      <TabsContent value="member" className="mt-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Users, label: "Contributors", value: "—" },
            { icon: HeartHandshake, label: "Community-Raised Funds", value: "—" },
            { icon: FlaskConical, label: "Active Grants Sponsored", value: "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-6 border-[1px] border-border bg-card text-center">
              <Icon size={20} className="text-accent mx-auto mb-3" strokeWidth={1.5} aria-hidden="true" />
              <div className="font-mono text-2xl font-semibold text-primary mb-1">{value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <div className="py-10 text-center border-[1px] border-dashed border-border">
          <p className="font-sans text-muted-foreground text-sm max-w-sm mx-auto">
            Member contribution tracking will appear here once donation records are connected.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
