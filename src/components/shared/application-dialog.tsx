import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Mail, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LINKS } from "@/config/links";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { OpenPosition } from "@/lib/open-positions";
import { cn } from "@/lib/utils";

interface ApplicationDialogProps {
  trigger: ReactNode;
  positions?: OpenPosition[];
  defaultPosition?: string;
  defaultDepartment?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function ApplicationDialog({
  trigger,
  positions = [],
  defaultPosition,
  defaultDepartment,
  title = "Apply for a position",
  description = "Choose the role you want to apply for. Your application goes straight to the MEDX admin dashboard.",
  className,
}: ApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailOpened, setEmailOpened] = useState(false);
  const [error, setError] = useState("");

  const defaultId = useMemo(() => {
    if (!positions.length) return "";
    return positions.find((position) => position.title === defaultPosition)?.id || positions[0].id;
  }, [positions, defaultPosition]);

  useEffect(() => {
    if (!open) return;
    setSelectedId(defaultId);
    setSubmitted(false);
    setEmailOpened(false);
    setError("");
  }, [open, defaultId]);

  const selectedPosition = positions.find((position) => position.id === selectedId);
  const positionTitle = selectedPosition?.title || defaultPosition || "";
  const department = selectedPosition?.department || defaultDepartment || "MEDX";

  function reset() {
    setName("");
    setEmail("");
    setSelectedId(defaultId);
    setMessage("");
    setPortfolioUrl("");
    setSubmitting(false);
    setSubmitted(false);
    setEmailOpened(false);
    setError("");
  }

  function openEmail() {
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Position: ${positionTitle || "-"}`,
      `Department: ${department}`,
      `Portfolio / CV: ${portfolioUrl || "-"}`,
      "",
      "Why I am interested:",
      message || "-",
    ].join("\n");
    const subject = `MEDX application — ${positionTitle || "Open position"}`;
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setEmailOpened(true);
    setError("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !positionTitle) {
      setError("Name, email, and position are required.");
      return;
    }

    if (!supabaseConfigured) {
      openEmail();
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("applications").insert({
      name: name.trim(),
      email: email.trim(),
      position: positionTitle,
      department,
      message: message.trim() || null,
      portfolio_url: portfolioUrl.trim() || null,
      status: "new",
    });
    setSubmitting(false);

    if (insertError) {
      setError("We could not save this application online. You can send it by email instead.");
      return;
    }

    setSubmitted(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn("sm:max-w-lg border-border", className)}>
        <DialogHeader>
          <DialogTitle className="font-sans text-xl text-foreground">{title}</DialogTitle>
          <DialogDescription className="font-sans text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center">
            <CheckCircle2 size={30} className="text-accent mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Your application for <strong className="text-foreground">{positionTitle}</strong> was received.
              MEDX will review it and reach out by email.
            </p>
            <DialogFooter className="mt-6">
              <Button type="button" onClick={() => handleOpenChange(false)} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : emailOpened ? (
          <div className="py-6 text-center">
            <Mail size={28} className="text-accent mx-auto mb-4" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Your email client should have opened with your application details. Send it to{" "}
              <strong className="text-foreground">{LINKS.email}</strong> to complete the submission.
            </p>
            <DialogFooter className="mt-6">
              <Button type="button" onClick={() => handleOpenChange(false)} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="application-name" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Full name *
              </Label>
              <Input
                id="application-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="application-email" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Email *
              </Label>
              <Input
                id="application-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="application-position" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Position *
              </Label>
              {positions.length ? (
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger id="application-position">
                    <SelectValue placeholder="Choose a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.title} — {position.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="border-[1px] border-border bg-muted/40 px-3 py-2 text-sm">
                  {positionTitle || "Open position"}
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-secondary">
                    {department}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="application-portfolio" className="text-xs uppercase tracking-widest font-mono text-secondary">
                CV / portfolio link
              </Label>
              <Input
                id="application-portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(event) => setPortfolioUrl(event.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="application-message" className="text-xs uppercase tracking-widest font-mono text-secondary">
                Why are you interested?
              </Label>
              <Textarea
                id="application-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                placeholder="Tell MEDX a little about your experience and interest in this role."
              />
            </div>

            {error ? (
              <div className="space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                <button
                  type="button"
                  onClick={openEmail}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent hover:opacity-70"
                >
                  <Mail size={13} aria-hidden="true" /> Send by email instead
                </button>
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground font-sans">
              Your application will appear in the MEDX admin dashboard. You can also{" "}
              <button type="button" onClick={openEmail} className="underline underline-offset-2 hover:text-accent">
                send it by email
              </button>
              .
            </p>

            <DialogFooter>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {submitting ? "Submitting..." : "Submit application"} <Send size={13} aria-hidden="true" />
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
