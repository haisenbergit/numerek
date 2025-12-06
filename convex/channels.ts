import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  getAuthenticatedUserId,
  getAuthenticatedUserIdForQuery,
} from "./utils";

export const remove = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found.");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin")
      throw new Error("Unauthorized: Only admins can update channel names");

    // TODO: Delete related data (e.g., messages) if necessary

    await ctx.db.delete(args.id);

    return args.id;
  },
});

export const updateName = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const channel = await ctx.db.get(args.id);
    if (!channel) throw new Error("Channel not found.");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin")
      throw new Error("Unauthorized: Only admins can update channel names");

    // Validate channel name length
    if (args.name.length < 3 || args.name.length > 80)
      throw new Error("Channel name must be between 3 and 80 characters.");

    // Validate channel name is not empty or only dashes
    if (!args.name.replace(/-/g, "").length)
      throw new Error("Channel name cannot be empty or whitespace only.");

    // Check for duplicate channel name in the workspace
    const existing = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_name", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("name", args.name)
      )
      .first();
    if (existing && existing._id !== args.id)
      throw new Error(
        "A channel with this name already exists in the workspace."
      );

    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin")
      throw new Error("Unauthorized: Only admins can create channels");

    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    // Validate channel name length
    if (parsedName.length < 3 || parsedName.length > 80)
      throw new Error("Channel name must be between 3 and 80 characters.");

    // Validate channel name is not empty or only dashes
    if (!parsedName.replace(/-/g, "").length)
      throw new Error("Channel name cannot be empty or whitespace only.");

    // Check for duplicate channel name in the workspace
    const existing = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id_name", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("name", parsedName)
      )
      .first();
    if (existing)
      throw new Error(
        "A channel with this name already exists in the workspace."
      );

    return await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });
  },
});

export const getById = query({
  args: { id: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserIdForQuery(ctx);
    if (!userId) return null;

    const channel = await ctx.db.get(args.id);
    if (!channel) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", channel.workspaceId).eq("userId", userId)
      )
      .first();

    if (!member) return null;

    return channel;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserIdForQuery(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();

    if (!member) return [];

    return await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();
  },
});
