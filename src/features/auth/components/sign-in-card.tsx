import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { OtpStep, SignInFlow } from "@/features/auth/types";
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState?: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>(OtpStep.Idle);
  const [otpCode, setOtpCode] = useState("");

  const onProviderSignIn = (provider: string) => {
    setPending(true);
    signIn(provider)
      .catch(() => setError("Failed to sign in with provider"))
      .finally(() => setPending(false));
  };

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => setError("Invalid email or password"))
      .finally(() => setPending(false));
  };

  const onOtpSendCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const otpEmail = formData.get("email") as string;
    signIn("resend-otp", formData)
      .then(() => {
        setEmail(otpEmail);
        setOtpStep(OtpStep.CodeSent);
      })
      .catch(() => setError("Failed to send code. Please try again."))
      .finally(() => setPending(false));
  };

  const onOtpVerifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    signIn("resend-otp", formData)
      .then(() => {
        // Reset state after successful verification
        setOtpStep(OtpStep.Idle);
        setOtpCode("");
        setEmail("");
      })
      .catch(() => {
        setError("Invalid code. Please try again.");
      })
      .finally(() => setPending(false));
  };

  const renderPasswordForm = () => (
    <form onSubmit={onPasswordSignIn} className="space-y-2.5">
      <Input
        disabled={pending}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <Input
        disabled={pending}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        Continue
      </Button>
    </form>
  );

  const renderOtpSendForm = () => (
    <form onSubmit={onOtpSendCode} className="space-y-2.5">
      <Input
        disabled={pending}
        name="email"
        placeholder="Email for OTP"
        type="email"
        required
      />
      <Button
        type="submit"
        variant="outline"
        className="w-full"
        size="lg"
        disabled={pending}
      >
        Send code via email
      </Button>
    </form>
  );

  const renderOtpVerifyForm = () => (
    <form onSubmit={onOtpVerifyCode} className="space-y-2.5">
      <Input
        disabled={pending}
        name="code"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        placeholder="Enter code"
        type="text"
        required
      />
      <input name="email" value={email} type="hidden" />
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        Verify code
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        disabled={pending}
        onClick={() => {
          setOtpStep(OtpStep.Idle);
          setOtpCode("");
          setError("");
        }}
      >
        Cancel
      </Button>
    </form>
  );

  const renderGoogleButton = () => (
    <div className="flex flex-col gap-y-2.5">
      <Button
        disabled={pending}
        onClick={() => onProviderSignIn("google")}
        variant="outline"
        size="lg"
        className="relative w-full"
      >
        <FcGoogle className="absolute left-2.5 top-2.5 size-4" />
        Continue with Google
      </Button>
    </div>
  );

  const renderSignUpLink = () => (
    <p className="text-xs text-muted-foreground">
      Don&apos;t have an account?{" "}
      <span
        onClick={() => setState && setState("signUp")}
        className="cursor-pointer text-sky-700 hover:underline"
      >
        Sign up
      </span>
    </p>
  );

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        {otpStep === OtpStep.Idle && (
          <>
            {renderPasswordForm()}
            <Separator />
            {renderOtpSendForm()}
          </>
        )}

        {otpStep === OtpStep.CodeSent && renderOtpVerifyForm()}
        {otpStep !== OtpStep.CodeSent && <Separator />}
        {otpStep !== OtpStep.CodeSent && renderGoogleButton()}
        {otpStep !== OtpStep.CodeSent && renderSignUpLink()}
      </CardContent>
    </Card>
  );
};
