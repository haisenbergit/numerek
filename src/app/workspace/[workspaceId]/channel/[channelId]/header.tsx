import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
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
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateNameChannel } from "@/features/channels/api/use-update-name-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirmationWindow } from "@/hooks/use-confirmation-window";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [ConfirmDialog, confirm] = useConfirmationWindow(
    "Delete this Channel?",
    "Are you sure you want to delete this channel? This action cannot be undone."
  );

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateNameChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (open: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(open);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { name: value, id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel name updated successfully!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel name.");
        },
      }
    );
  };

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    await removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted successfully!");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel.");
        },
      }
    );
  };

  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-auto overflow-hidden px-2 text-lg font-semibold"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="ml-2 size-2.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden bg-gray-50 p-0">
          <DialogHeader className="border-b bg-white p-4">
            <DialogTitle># {title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-y-2 px-4 pb-4">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer rounded-lg border bg-white px-5 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    {member?.role === "admin" && (
                      <p className="text-sm font-semibold text-[#1264a3] hover:underline">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isUpdatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
