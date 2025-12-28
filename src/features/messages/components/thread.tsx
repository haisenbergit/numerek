import { Id } from "@convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { useGetMessage } from "@/features/messages/api/use-get-message";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });
  if (loadingMessage)
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );

  if (!message)
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-[49px] items-center justify-between border-b px-4">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full flex-col items-center justify-center gap-y-2">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message.user.image}
          authorName={message.user.name}
          isAuthor={false}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={false}
          setEditingId={() => {}}
        />
      </div>
    </div>
  );
};
