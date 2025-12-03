import { FaChevronDown } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex h-[49px] items-center overflow-hidden border-b bg-white px-4">
      <Button
        variant="ghost"
        className="w-auto overflow-hidden px-2 text-lg font-semibold"
        size="sm"
      >
        <span className="truncate"># {title}</span>
        <FaChevronDown className="ml-2 size-2.5" />
      </Button>
    </div>
  );
};
