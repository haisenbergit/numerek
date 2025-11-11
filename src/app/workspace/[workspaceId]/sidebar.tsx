import { usePathname } from "next/navigation";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";
import { UserAvatar } from "@/features/auth/components/user-avatar";
import { SidebarButton } from "@/app/workspace/[workspaceId]/sidebar-button";
import { WorkspaceSwitcher } from "@/app/workspace/[workspaceId]/workspace-switcher";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] py-[19px]">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessagesSquare} label="DMs" />
      <SidebarButton icon={Bell} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
        <UserAvatar />
      </div>
    </aside>
  );
};
