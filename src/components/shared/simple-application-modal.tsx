import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LINKS } from "@/config/links";
import { Mail, ArrowRight } from "lucide-react";

export interface QAField {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

interface SimpleApplicationModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  fields: QAField[];
  /** Email subject line generated for the mailto compose action */
  subject: string;
  submitLabel?: string;
  note?: string;
}

/**
 * A lightweight, no-backend "Q&A" submission modal. There is no server to
 * POST to, so submitting composes a pre-filled mailto: email to MEDX instead
 * of pretending to submit anywhere - honest about what actually happens.
 */
export function SimpleApplicationModal({
  trigger,
  title,
  description,
  fields,
  subject,
  submitLabel = "Compose Application Email",
  note,
}: SimpleApplicationModalProps) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function update(name: string, val: string) {
    setValues((v) => ({ ...v, [name]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bodyLines = fields.map((f) => `${f.label}: ${values[f.name] || "-"}`);
    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          setSent(false);
          setValues({});
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle className="font-sans text-xl text-foreground">{title}</DialogTitle>
          {description && (
            <DialogDescription className="font-sans text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {sent ? (
          <div className="py-6 text-center">
            <Mail size={28} className="text-accent mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Your email client should have opened with your responses pre-filled.
              Please review it and hit send to <strong className="text-foreground">{LINKS.email}</strong> to
              complete your submission.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <Label
                  htmlFor={f.name}
                  className="text-xs uppercase tracking-widest font-mono text-secondary"
                >
                  {f.label}
                  {f.required && " *"}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.name}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.name] || ""}
                    onChange={(e) => update(f.name, e.target.value)}
                    rows={4}
                  />
                ) : f.type === "select" && f.options ? (
                  <Select value={values[f.name] || ""} onValueChange={(v) => update(f.name, v)}>
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder={f.placeholder || "Select..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type === "email" ? "email" : "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.name] || ""}
                    onChange={(e) => update(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            {note && <p className="text-xs text-muted-foreground font-sans italic">{note}</p>}
            <DialogFooter>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-semibold tracking-widest uppercase text-xs hover:bg-accent/90 transition-colors"
              >
                {submitLabel} <ArrowRight size={13} aria-hidden="true" />
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
