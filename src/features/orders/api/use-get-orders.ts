import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetOrders = () => {
  const data = useQuery(api.orders.get);
  const isLoading = data === undefined;

  return { data, isLoading };
};
