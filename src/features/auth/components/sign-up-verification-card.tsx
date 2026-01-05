"use client";

import React, { useEffect, useRef, useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthFlow } from "@/features/auth/types";

interface SignUpVerificationCardProps {
  setAuthState: (state: AuthFlow) => void;
  onVerified: (code: string) => void;
  error?: string;
}

export const SignUpVerificationCard = ({
  setAuthState,
  onVerified,
  error: externalError,
}: SignUpVerificationCardProps) => {
  const [accessCode, setAccessCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [errorToDisplay, setErrorToDisplay] = useState(externalError);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(true);
  const otpContainerRef = useRef<HTMLDivElement>(null);

  const isCodeComplete = accessCode.length === 6;

  useEffect(() => {
    setErrorToDisplay(externalError);
  }, [externalError]);

  const focusFirstOtpInput = () => {
    if (otpContainerRef.current) {
      const firstInput = otpContainerRef.current.querySelector("input");
      if (firstInput) (firstInput as HTMLInputElement).focus();
    }
  };

  const triggerOtpAutofocus = () => setShouldAutoFocus(true);
  const resetOtpAutofocus = () => setShouldAutoFocus(false);

  useEffect(() => {
    if (shouldAutoFocus) {
      focusFirstOtpInput();
      resetOtpAutofocus();
    }
  }, [shouldAutoFocus, errorToDisplay]);

  const handleChange = (accessCode: string) => {
    setAccessCode(accessCode.toUpperCase());
    if (errorToDisplay) setErrorToDisplay(undefined);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChecking(true);
    onVerified(accessCode);
    setIsChecking(false);
    triggerOtpAutofocus();
  };

  useEffect(() => {
    if (errorToDisplay) triggerOtpAutofocus();
  }, [errorToDisplay]);

  return (
    <Card className="h-full w-full p-8">
      <Header />
      <ShowError error={errorToDisplay} />
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex justify-center" ref={otpContainerRef}>
            <AccessCodeInput
              value={accessCode}
              onChange={handleChange}
              disabled={isChecking}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isChecking || !isCodeComplete}
          >
            {isChecking ? "Weryfikacja..." : "Kontynuuj"}
          </Button>
        </form>
        <SignInLink setAuthState={setAuthState} />
      </CardContent>
    </Card>
  );
};

function Header() {
  return (
    <CardHeader className="px-0 pt-0">
      <CardTitle>Weryfikacja dostępu</CardTitle>
      <CardDescription>
        Wprowadź kod dostępu do Grupy, aby kontynuować rejestrację
      </CardDescription>
    </CardHeader>
  );
}

function AccessCodeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={false}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function SignInLink({
  setAuthState,
}: {
  setAuthState: (state: AuthFlow) => void;
}) {
  return (
    <p className="text-xs text-muted-foreground">
      Masz już konto?{" "}
      <button
        type="button"
        onClick={() => setAuthState("signIn")}
        className="cursor-pointer border-0 bg-transparent p-0 text-sky-700 hover:underline"
      >
        Zaloguj się
      </button>
    </p>
  );
}

function ShowError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div className="mb-6 flex items-center justify-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <TriangleAlert className="size-4" />
      <p>{error}</p>
    </div>
  );
}
