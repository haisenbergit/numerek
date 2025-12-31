import dynamic from "next/dynamic";
import { Doc, Id } from "@convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { Hint } from "@/components/hint";
import { Reactions } from "@/components/reactions";
import { ThreadBar } from "@/components/thread-bar";
import { Thumbnail } from "@/components/thumbnail";
import { Toolbar } from "@/components/toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useToggleReactions } from "@/features/reactions/api/use-toggle-reaction";
import { cn } from "@/lib/utils";
import { useConfirmationWindow } from "@/hooks/use-confirmation-window";
import { usePanel } from "@/hooks/use-panel";

const Renderer = dynamic(() => import("./renderer"), { ssr: false });
const Editor = dynamic(() => import("./editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}
const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "HH:mm:ss")}`;
};

export const Message = ({
  id,
  isAuthor,
  memberId,
  authorImage,
  authorName = "Member",
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const { parentMessageId, onOpenMessage, onClose } = usePanel();

  const [ConfirmDialog, confirm] = useConfirmationWindow(
    "Delete Message",
    "Are you sure you want to delete this message? This action cannot be undone."
  );
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReactions();

  const isPending = isUpdatingMessage;

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Failed to toggle reaction");
        },
      }
    );
  };

  const handleRemove = async () => {
    const isConfirmed = await confirm();
    if (!isConfirmed) return;

    await removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          if (parentMessageId === id) onClose();
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      }
    );
  };

  const handleUpdate = async ({ body }: { body: string }) => {
    await updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "duration-400 origin-bottom scale-y-0 transform bg-rose-500/50 transition-all"
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="w-[40px] text-center text-xs leading-[22px] text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
            {isEditing ? (
              <div className="h-full w-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  // https://github.com/haisenbergit/grupa/pull/33#discussion_r2649049814
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="edit"
                />
              </div>
            ) : (
              <div className="flex w-full flex-col">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "duration-400 origin-bottom scale-y-0 transform bg-rose-500/50 transition-all"
        )}
      >
        <div className="flex items-start gap-2">
          <button>
            <Avatar>
              <AvatarImage src={authorImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="h-full w-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                // https://github.com/haisenbergit/grupa/pull/33#discussion_r2649049816
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="edit"
              />
            </div>
          ) : (
            <div className="flex w-full flex-col overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => {}}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "h:mm a")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
