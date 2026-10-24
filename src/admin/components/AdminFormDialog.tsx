import type { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel,
  formId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: () => void;
  submitLabel: string;
  formId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-5 border-b-[1px] border-border">
          <DialogTitle className="font-serif text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form
          id={formId}
          className="flex min-h-0 flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="max-h-[60vh] overflow-y-auto px-6 py-5 space-y-4">
            {children}
          </div>
          <DialogFooter className="border-t-[1px] border-border px-6 py-4 gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
