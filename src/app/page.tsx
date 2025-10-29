"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <div>Logged in! Welcome on the main page!</div>
      <Button onClick={() => signOut()}>Log out!</Button>
    </div>
  );
}
