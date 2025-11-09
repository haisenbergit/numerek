import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function getAuthenticatedUserId(ctx: any): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error(`Not authenticated userId: ${userId}`);

  return userId as Id<"users">;
}

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    return await ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return await ctx.db.insert("workspaces", {
      name: args.name,
      userId: userId,
      joinCode: joinCode,
    });
  },
});
