import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthenticatedUserIdForQuery } from "./utils";

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserIdForQuery(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();

    if (!member) return null;

    return await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
  },
});
