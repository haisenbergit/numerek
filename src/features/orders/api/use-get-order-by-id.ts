import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";

export const useGetOrderById = (orderId: Id<"orders"> | null) => {
  const data = useQuery(api.orders.getById, orderId ? { orderId } : "skip");
  const isLoading = data === undefined;

  return { data, isLoading };
};
