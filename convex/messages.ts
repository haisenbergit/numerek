import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { QueryCtx, mutation } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId)
    )
    .unique();
};

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    // TODO: add conversationId
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member)
      throw new Error("Unauthorized: Only workspace members can post messages");

    // Todo: handle conversationId

    return await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });
  },
});
