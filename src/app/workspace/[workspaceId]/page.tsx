"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return (
    <div className="justify-top flex h-full w-full flex-col items-center gap-4 p-5">
      <div>Welcome to Workspace: {data?.name ?? "Loading..."}</div>
    </div>
  );
};

export default WorkspaceIdPage;
