"use client";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
};

export const Modals = () => {
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
    </>
  );
};
