import { useEffect, useRef, useState } from "react";
import Quill from "quill";

interface RendererProps {
  value: string;
}

const Renderer = ({ value }: RendererProps) => {
  const [isEmpty, setIsEmpty] = useState(false);
  const rendererRef = useRef<HTMLDivElement>(null);

  // A new Quill instance is created on every render when the value changes.
  // This could be inefficient for frequently updating messages. Consider memoizing the Quill instance
  // or using a more lightweight parsing approach if only rendering is needed, not editing functionality.
  // https://github.com/haisenbergit/grupa/pull/30#discussion_r2643787176
  useEffect(() => {
    if (!rendererRef.current) return;

    const container = rendererRef.current;
    const quill = new Quill(document.createElement("div"), {
      theme: "snow",
    });

    quill.enable(false);

    const contents = JSON.parse(value);
    quill.setContents(contents);

    const isEmpty =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;
    setIsEmpty(isEmpty);

    container.innerHTML = quill.root.innerHTML;

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [value]);

  if (isEmpty) return null;

  return <div ref={rendererRef} className="ql-editor" />;
};

export default Renderer;
