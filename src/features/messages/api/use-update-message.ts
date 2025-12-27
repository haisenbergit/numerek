import { useCallback, useMemo, useState } from "react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "convex/react";

type RequestType = {
  body: string;
  id: Id<"messages">;
};
type ResponseType = Id<"messages"> | null;

type Options = {
  onSuccess?: (data: ResponseType) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  throwOnError?: boolean;
};

export const useUpdateMessage = () => {
  const [data, setData] = useState<ResponseType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "settled" | "pending" | "success" | "error" | null
  >(null);
  const isPending = useMemo(() => status === "pending", [status]);
  const isSuccess = useMemo(() => status === "success", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const isSettled = useMemo(() => status === "settled", [status]);

  const mutation = useMutation(api.messages.update);

  const mutate = useCallback(
    async (values: RequestType, options?: Options) => {
      try {
        setData(null);
        setError(null);
        setStatus("pending");

        const response = await mutation(values);
        setData(response);
        setStatus("success");
        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        setError(error as Error);
        setStatus("error");
        options?.onError?.(error as Error);
        if (options?.throwOnError) throw error;
        return null;
      } finally {
        // The state management logic has a bug. Setting status to "settled" in the finally block will overwrite
        // the "success" or "error" status that was just set in the try or catch blocks.
        // This means the isSuccess and isError flags will never be true by the time they're returned to the caller.
        // Consider removing the "settled" status or restructuring the logic to maintain the success/error state.
        // https://github.com/haisenbergit/grupa/pull/33#discussion_r2649049807
        setStatus("settled");
        options?.onSettled?.();
      }
    },
    [mutation]
  );
  return {
    mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    isSettled,
  };
};
