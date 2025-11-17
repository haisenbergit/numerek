import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useRenameWorkspace } from "@/features/workspaces/api/use-rename-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const workspaceId = useWorkspaceId();
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: renameWorkspace, isPending: isRenamingWorkspace } =
    useRenameWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();

    await renameWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          toast.success("Workspace renamed successfully");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to rename workspace");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden bg-gray-50 p-0">
        <DialogHeader className="border-b bg-white p-4">
          <DialogTitle>{value}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-2 px-4 pb-4">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Workspace name</p>
                  <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                    Edit
                  </p>
                </div>
                <p className="text-sm">{value}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename this Workspace</DialogTitle>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleRename}>
                <Input
                  value={value}
                  disabled={isRenamingWorkspace}
                  onChange={(e) => setValue(e.target.value)}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={50}
                  placeholder="Workspace new name"
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isRenamingWorkspace}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button disabled={isRenamingWorkspace}>Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <button
            disabled={false}
            onClick={() => {}}
            className="hover:bg-grey-50 flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600"
          >
            <TrashIcon className="size-4" />
            <p className="text-sm font-semibold">Delete Workspace</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
