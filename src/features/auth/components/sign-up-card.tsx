import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthFlow } from "@/features/auth/types";

interface SignUpCardProps {
  setAuthState?: (state: AuthFlow) => void;
}

export const SignUpCard = ({ setAuthState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onProviderSignUp = (provider: string) => {
    setPending(true);
    signIn(provider)
      .catch(() => setError("Failed to sign up with provider"))
      .finally(() => setPending(false));
  };

  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setPending(true);
    signIn("password", { email, password, flow: "signUp" })
      .catch(() => setError("Failed to sign up. Please try again."))
      .finally(() => setPending(false));
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Zarejestruj się, aby kontynuować</CardTitle>
        <CardDescription>Użyj Google lub e-mail</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => {
              onProviderSignUp("google");
            }}
            variant="secondary"
            size="lg"
            className="relative w-full"
          >
            <FcGoogle
              className="absolute left-2.5"
              style={{ width: 20, height: 20 }}
            />
            Continue with Google
          </Button>
        </div>
        <Separator />
        <form onSubmit={onPasswordSignUp} className="space-y-2.5">
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
          <Input
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Masz już konto?{" "}
          <span
            onClick={() => setAuthState && setAuthState("signIn")}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Zaloguj się
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
