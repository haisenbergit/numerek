import { UserAvatar } from "@/features/auth/components/user-avatar";
import { WorkspaceSwitcher } from "@/app/workspace/[workspaceId]/workspace-switcher";

export const Sidebar = () => {
  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] py-[19px]">
      <WorkspaceSwitcher />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserAvatar />
      </div>
    </aside>
  );
};
