import { useEffect, useRef } from "react";
import { ImageIcon, Smile } from "lucide-react";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { Button } from "@/components/ui/button";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
    };

    new Quill(editorContainer, options);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="transit flex flex-col overflow-hidden rounded-md border border-slate-200 focus-within:border-slate-300 focus-within:shadow-sm">
        <div ref={containerRef} className="ql-custom h-full" />
        <div className="z-[5] flex px-2 pb-2">
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <PiTextAa className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <Smile className="size-4" />
          </Button>
          <Button
            disabled={false}
            size="iconSm"
            variant="ghost"
            onClick={() => {}}
          >
            <ImageIcon className="size-4" />
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            size="iconSm"
            className="ml-auto bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
          >
            <MdSend className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
