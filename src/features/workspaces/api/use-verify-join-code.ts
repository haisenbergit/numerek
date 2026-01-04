import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

interface UseVerifyJoinCodeProps {
  joinCode: string;
}

export const useVerifyJoinCode = ({ joinCode }: UseVerifyJoinCodeProps) => {
  const data = useQuery(
    api.workspaces.verifyJoinCode,
    joinCode ? { joinCode } : "skip"
  );
  const isLoading = data === undefined;

  return { data, isLoading };
};
