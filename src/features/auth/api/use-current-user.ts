import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const UseCurrentUser = () => {
  const data = useQuery(api.users.current);
  const isLoading = data === undefined;

  return { data, isLoading };
};
