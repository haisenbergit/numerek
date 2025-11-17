import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    return await ctx.db
      .query("workspaces")
      .filter((q) =>
        q.or(...workspaceIds.map((id) => q.eq(q.field("_id"), id)))
      )
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .first();

    if (!member) return null;

    return await ctx.db.get(args.id);
  },
});

function generateJoinCode(): string {
  const length = 6;
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    validateWorkspaceNameLength(args.name);

    const name = args.name.trim();
    const userId = await getAuthenticatedUserId(ctx);
    const joinCode = generateJoinCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name,
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

export const rename = mutation({
  args: { id: v.id("workspaces"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized: Only admins can rename the workspace");
    }

    await ctx.db.patch(args.id, { name: args.name.trim() });

    return args.id;
  },
});

function validateWorkspaceNameLength(name: string) {
  if (name.length < 4)
    throw new Error("Workspace name must be at least 4 characters long");
}
