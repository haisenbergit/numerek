import { useRef } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
    createMessage({
      workspaceId,
      channelId,
      body,
    });
  };

  return (
    <div className="w-full px-5">
      <Editor
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};
