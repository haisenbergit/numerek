import { UserAvatar } from "@/features/auth/components/user-avatar";

export const Sidebar = () => {
  return (
    <aside className="pt-b-[4px] flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pt-[9px]">
      <div>A</div>
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserAvatar />
      </div>
    </aside>
  );
};
