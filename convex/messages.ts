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
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member)
      throw new Error("Unauthorized: Only workspace members can post messages");

    let _conversationId = args.conversationId;
    // Only possible if we are replying in a thread 1:1 conversation
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error("Parent message not found");

      _conversationId = parentMessage.conversationId;
    }

    // validation to ensure messages belong to either a channel OR a conversation, but not both or neither
    // (except for thread replies). The current logic allows creating a message with both channelId and conversationId set,
    // or with neither set (when not a thread reply), which could lead to data inconsistencies.
    // This validation enforce this business rule.
    const hasChannel = !!args.channelId;
    const hasConversation = !!_conversationId;
    if ((hasChannel && hasConversation) || (!hasChannel && !hasConversation))
      throw new Error(
        "Message must belong to either a channel or a conversation, but not both or neither"
      );

    return await ctx.db.insert("messages", {
      body: args.body,
      image: args.image,
      memberId: member._id,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      conversationId: _conversationId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });
  },
});
