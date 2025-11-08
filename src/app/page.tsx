"use client";

import { useEffect, useMemo } from "react";
import { UserAvatar } from "@/features/auth/components/user-avatar";
import { UseGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { UseCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = UseCreateWorkspaceModal();
  const { data, isLoading } = UseGetWorkspaces();
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      console.log("Redirect to workspace ID:", workspaceId);
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen, router]);

  return (
    <div className="justify-top flex h-screen w-screen flex-col items-end gap-4 p-5">
      <div>Logged in! Welcome on the main page!</div>
      <UserAvatar />
    </div>
  );
}
