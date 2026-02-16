import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUserId } from "./utils";

// examples: workspaces.ts

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthenticatedUserId(ctx);

    return await ctx.db
      .query("orders")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_active_code", (q) =>
        q.eq("code", args.code).eq("isActive", true)
      )
      .first();

    return order;
  },
});

export const create = mutation({
  args: {
    timeInMinutes: v.number(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);
    const code = generateJoinCode();
    const timestampNow = Date.now();
    const timeInMilliseconds = args.timeInMinutes * 60 * 1000;
    const orderTime = timestampNow + timeInMilliseconds;
    const isActive = true;
    const isReady = false;

    return await ctx.db.insert("orders", {
      userId,
      code,
      orderTime,
      isActive,
      isReady,
      name: args.name,
    });
  },
});

export const close = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const order = await ctx.db.get(args.orderId);

    if (!order) throw new Error("Order not found");

    if (order.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.orderId, { isActive: false });

    return args.orderId;
  },
});

export const markAsReady = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUserId(ctx);

    const order = await ctx.db.get(args.orderId);

    if (!order) throw new Error("Order not found");

    if (order.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.orderId, {
      isReady: true,
      readyTime: Date.now()
    });

    return args.orderId;
  },
});

function generateJoinCode(): string {
  const length = 3;
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}