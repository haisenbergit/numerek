"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetOrderByCode } from "@/features/orders/api/use-get-order-by-code";
import { CodeInputModal } from "@/features/orders/components/code-input-modal";

const Timer = () => {
  const router = useRouter();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const { data: order, isLoading } = useGetOrderByCode(submittedCode);

  useEffect(() => {
    if (submittedCode && !isLoading) {
      if (!order) {
        toast.error("Nie znaleziono aktywnego zamówienia o podanym kodzie");
        setSubmittedCode(null);
      } else {
        // Przekieruj do strony z ID zamówienia
        router.push(`/timer/${order._id}`);
      }
    }
  }, [order, isLoading, submittedCode, router]);

  const handleCodeSubmit = (code: string) => {
    setSubmittedCode(code);
  };

  // Pokazuj loader gdy sprawdzamy kod (także podczas samego ustawiania kodu)
  if (submittedCode) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <CodeInputModal open={true} onCodeSubmitAction={handleCodeSubmit} />
  );
};

export default Timer;
