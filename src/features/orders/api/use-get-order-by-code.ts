import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const useGetOrderByCode = (code: string | null) => {
  const data = useQuery(api.orders.getByCode, code ? { code } : "skip");
  const isLoading = data === undefined;

  return { data, isLoading };
};
