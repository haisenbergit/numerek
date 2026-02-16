import { useParams } from "next/navigation";
import { Id } from "@convex/_generated/dataModel";

export const useOrderId = () => {
  const params = useParams();
  return params.orderId as Id<"orders">;
};
