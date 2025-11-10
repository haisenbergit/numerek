import { useRouter } from "next/navigation";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const otherWorkspacesThanCurrentOne = workspaces?.filter(
    (ws) => ws?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative size-9 overflow-hidden bg-[#ABABAD] text-xl font-semibold text-slate-800 hover:bg-[#ABABAD]/80">
          {workspaceLoading ? (
            <Loader className="size-5 shrink-0 animate-spin" />
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="flex cursor-pointer flex-col items-start justify-start"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            as Active workspace
          </span>
        </DropdownMenuItem>
        {otherWorkspacesThanCurrentOne?.map((workspace) => (
          <DropdownMenuItem
            key={workspace!._id}
            onClick={() => router.push(`/workspace/${workspace!._id}`)}
            className="flex cursor-pointer items-center justify-start"
          >
            <div className="lext-lg relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#616061] font-semibold text-white">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            {workspace?.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="lext-lg relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#F2F2F2] font-semibold text-slate-800">
            <Plus />
          </div>
          Create New Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
