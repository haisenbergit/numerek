import { Id } from "@convex/_generated/dataModel";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[49px] items-center justify-between border-b px-4">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
    </div>
  );
};
