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
import { SignInFlow } from "@/features/auth/types";
import { useState } from "react";

interface SignUpCardProps {
  setState?: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add sign up logic here
  };

  return (
    <Card className="h-full w-full space-y-2 p-8">
      <CardHeader className="px-1 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
      </CardHeader>
      <CardDescription className="px-1">
        Use your email or another service to continue
      </CardDescription>
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSubmit} className="space-y-2.5">
          <Input
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input
            disabled={false}
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
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={false}
            // onClick={() => {}} // Add your Google sign-up logic here
            variant="outline"
            size="lg"
            className="relative w-full"
          >
            <FcGoogle className="absolute left-2.5 top-2.5 size-4" />
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState && setState("signIn")}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
