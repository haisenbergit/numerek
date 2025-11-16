import { Doc } from "@convex/_generated/dataModel";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
}

export const WorkspaceHeader = ({ workspace }: WorkspaceHeaderProps) => {
  return (
    <div className="flex h-[49px] items-center justify-between gap-0.5 px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="w-auto overflow-hidden p-1.5 text-lg font-semibold"
            size="sm"
          >
            <span className="truncate">{workspace.name}</span>
            <ChevronDown className="ml-1 size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
};
