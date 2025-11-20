import { AlertTriangle, Loader, MessageSquareText } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { SidebarItem } from "@/app/workspace/[workspaceId]/sidebar-item";
import { WorkspaceHeader } from "@/app/workspace/[workspaceId]/workspace-header";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (memberLoading || workspaceLoading)
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5F]">
        <Loader className="size-6 animate-spin text-white" />
      </div>
    );

  if (!member || !workspace)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-2 bg-[#5E2C5F]">
        <AlertTriangle className="size-6 text-white" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );

  return (
    <div className="flex h-full flex-col bg-[#5E2C5F]">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="mt-3 flex flex-col px-2">
        <SidebarItem label="Threads" id="threads" icon={MessageSquareText} />
      </div>
    </div>
  );
};
