import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { DEPARTMENTS } from "@/data/departments";
import { useAuth } from "../auth/AuthProvider";
import { isSuperAdmin } from "../auth/access";

interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  department_slug: string | null;
}

const ROLES = [
  { value: "super_admin", label: "Super admin" },
  { value: "admin", label: "Admin (legacy)" },
  { value: "department_admin", label: "Department admin" },
  { value: "editor", label: "Content editor" },
];

export function AccessManager() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, { role: string; department: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,department_slug")
      .order("email");
    if (error) {
      toast({
        title: "Could not load admin access",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const nextRows = (data || []) as ProfileRow[];
    setRows(nextRows);
    setDraft(
      Object.fromEntries(
        nextRows.map((row) => [
          row.id,
          { role: row.role || "editor", department: row.department_slug || "" },
        ]),
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    if (isSuperAdmin(profile?.role)) load();
  }, [profile?.role]);

  if (!isSuperAdmin(profile?.role)) return null;

  const save = async (row: ProfileRow) => {
    const current = draft[row.id];
    if (!current) return;
    setSavingId(row.id);
    const { error } = await supabase
      .from("profiles")
      .update({
        role: current.role,
        department_slug: current.role === "department_admin" ? current.department || null : null,
      })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast({ title: "Could not update access", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Access updated", description: `${row.email || row.full_name || "User"} saved.` });
    await load();
  };

  return (
    <section className="mt-6 border-[1px] border-border bg-card p-6" aria-labelledby="access-manager-heading">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck size={18} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
        <h2 id="access-manager-heading" className="font-semibold text-base text-primary">
          Admin roles
        </h2>
      </div>
      <p className="font-sans text-xs text-muted-foreground leading-relaxed mb-5">
        Super admins manage everything. Department admins can manage only their department team and media.
        Create the Supabase Auth user and its profiles row first (see the migration notes), then assign the role here.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading accounts...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No profiles found yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const current = draft[row.id] || { role: row.role || "editor", department: row.department_slug || "" };
            return (
              <div
                key={row.id}
                className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_180px_190px_auto] gap-3 items-center border-[1px] border-border bg-background p-4"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{row.full_name || row.email || "Unnamed user"}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                    {row.email || row.id}
                  </p>
                </div>
                <select
                  value={current.role}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      [row.id]: { ...current, role: event.target.value },
                    })
                  }
                  className="h-10 border-[1px] border-border bg-card px-3 text-sm"
                  aria-label={`Role for ${row.email || row.full_name || row.id}`}
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <select
                  value={current.department}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      [row.id]: { ...current, department: event.target.value },
                    })
                  }
                  disabled={current.role !== "department_admin"}
                  className="h-10 border-[1px] border-border bg-card px-3 text-sm disabled:opacity-50"
                  aria-label={`Department for ${row.email || row.full_name || row.id}`}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department.slug} value={department.slug}>
                      {department.shortName}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => save(row)}
                  disabled={savingId === row.id}
                >
                  {savingId === row.id ? "Saving..." : "Save"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
