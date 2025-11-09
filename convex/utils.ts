import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";

export async function getAuthenticatedUserId(
  ctx: QueryCtx | MutationCtx
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("User is not authenticated");

  return userId as Id<"users">;
}
