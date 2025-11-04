"use client";

import { UserAvatar } from "@/features/auth/components/user-avatar";

export default function Home() {
  return (
    <div className="justify-top flex h-screen w-screen flex-col items-end gap-4 p-5">
      <div>Logged in! Welcome on the main page!</div>
      <UserAvatar />
    </div>
  );
}
