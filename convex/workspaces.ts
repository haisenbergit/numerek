import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const joinCode = "123456";
    // const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return await ctx.db.insert("workspaces", {
      name: args.name,
      userId: userId,
      joinCode: joinCode,
    });
  },
});
