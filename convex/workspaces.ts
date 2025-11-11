import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils";

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

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    await getAuthenticatedUserId(ctx);

    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    validateWorkspaceNameLength(args.name);

    const userId = await getAuthenticatedUserId(ctx);
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

function validateWorkspaceNameLength(name: string) {
  if (name.length < 4)
    throw new Error("Workspace name must be at least 4 characters long");
}
