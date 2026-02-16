"use client";

import { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Progress } from "@/components/ui/progress";

type CodeInputModalProps = {
  open: boolean;
  onCodeSubmitAction: (code: string) => void;
};

export const CodeInputModal = ({
  open,
  onCodeSubmitAction,
}: CodeInputModalProps) => {
  const [code, setCode] = useState("");

  const isCodeComplete = code.length === 3;
  const progressValue = (code.length / 3) * 100;

  const handleChange = (value: string) => {
    setCode(value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCodeComplete) onCodeSubmitAction(code);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Wprowadź kod</DialogTitle>
          <DialogDescription>
            Wpisz 3-znakowy kod odbioru zamówienia.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-2 flex min-h-[44px] items-center justify-center gap-x-2 p-3">
          <Progress
            value={progressValue}
            className="h-1 max-w-[66%] bg-gray-100 [&>div]:bg-green-600"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={3}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={code}
                onChange={handleChange}
                autoFocus={false}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" className="w-full" disabled={!isCodeComplete}>
              Pokaż zamówienie
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
