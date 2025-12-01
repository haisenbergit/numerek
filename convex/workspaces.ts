import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthenticatedUserId,
  getAuthenticatedUserIdForQuery,
} from "./utils";

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

export const getInfoById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserIdForQuery(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .first();

    const workspace = await ctx.db.get(args.id);

    return {
      name: workspace?.name,
      isMember: !!member,
    };
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

export const join = mutation({
  args: { joinCode: v.string(), workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("Workspace not found");

    if (workspace.joinCode !== args.joinCode.toUpperCase())
      throw new Error("Invalid join code");

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();

    if (existingMember)
      throw Error("User is already a member of the workspace");

    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace._id,
      role: "member",
    });

    return workspace._id;
  },
});

export const newJoinCode = mutation({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized: Only admins can generate a new join code");
    }

    const newCode = generateJoinCode();

    await ctx.db.patch(args.workspaceId, { joinCode: newCode });

    return args.workspaceId;
  },
});

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

    await ctx.db.insert("channels", { name: "general", workspaceId });

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

export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.id).eq("userId", userId)
      )
      .first();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized: Only admins can delete the workspace");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

function validateWorkspaceNameLength(name: string) {
  if (name.length < 4)
    throw new Error("Workspace name must be at least 4 characters long");
}
