import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
      <div className="flex-1" />
      <div className="max-[642px] min-w-[280px] shrink grow-[2]">
        <Button
          size="sm"
          className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
        ></Button>
      </div>
    </nav>
  );
};
