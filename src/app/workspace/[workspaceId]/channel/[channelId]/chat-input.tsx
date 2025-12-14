import { useRef } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
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
