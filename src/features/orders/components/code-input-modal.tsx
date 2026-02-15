"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type CodeInputModalProps = {
  open: boolean;
  onCodeSubmitAction: (code: string) => void;
};

export const CodeInputModal = ({
  open,
  onCodeSubmitAction,
}: CodeInputModalProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upperCode = code.toUpperCase().trim();
    if (upperCode.length === 3) {
      onCodeSubmitAction(upperCode);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Wprowadź kod odbioru</DialogTitle>
          <DialogDescription>
            Wpisz 3-znakowy kod odbioru zamówienia, aby zobaczyć timer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder=""
                maxLength={3}
                className="text-center font-mono text-2xl font-bold uppercase tracking-widest"
                autoFocus
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={code.trim().length !== 3}
            >
              Sprawdź kod
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
