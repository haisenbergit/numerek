import { Loader } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberloading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (memberloading || workspaceLoading)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Loader className="size-6 animate-spin text-white" />
      </div>
    );

  return <div className="">Workspace Sidebar</div>;
};
