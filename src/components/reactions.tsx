import { Doc, Id } from "@convex/_generated/dataModel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
}

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const currentMemberId = currentMember?._id;
  if (data.length === 0 || !currentMemberId) return null;

  return (
    <div className="mb-1 mt-1 flex items-center gap-1">
      {data.map((reaction) => (
        <button
          className={cn(
            "flex h-6 items-center gap-x-1 rounded-full border border-transparent bg-slate-200/70 px-2 text-slate-800",
            reaction.memberIds.includes(currentMemberId) &&
              "border-blue-500 bg-blue-100/70 text-white"
          )}
        >
          {reaction.value}
          <span
            className={cn(
              "text-xs font-semibold text-muted-foreground",
              reaction.memberIds.includes(currentMemberId) && "text-blue-500"
            )}
          >
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
};
