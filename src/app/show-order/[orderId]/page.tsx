"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import ShiftingCountdown from "@/components/shifting-countdown";
import { useGetOrderById } from "@/features/orders/api/use-get-order-by-id";
import { useOrderId } from "@/hooks/use-order-id";

const ShowOrderPage = () => {
  const router = useRouter();
  const orderId = useOrderId();
  const { data: order, isLoading } = useGetOrderById(orderId);

  useEffect(() => {
    if (!isLoading && !order) {
      toast.error("Nie znaleziono aktywnego zamówienia");
      router.push("/show-order");
    }
  }, [order, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const orderDate = new Date(order.orderTime);
  const now = new Date();
  const isPast = orderDate < now;

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          {order.name && (
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">
              {order.name}
            </h2>
          )}
          <h1 className="text-4xl font-bold text-gray-800">
            Zamówienie #{order.code}
          </h1>
          {!order.isReady && (
            <p className="mt-2 text-lg text-gray-600">
              {isPast ? "Termin odbioru minął" : "Czas do odbioru"}
            </p>
          )}
        </div>

        {!order.isReady && <ShiftingCountdown countdownTo={orderDate} />}

        {order.isReady && (
          <div className="mt-6 rounded-lg border-2 border-green-500 bg-green-50 p-4 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✓</span>
              <p className="text-xl font-bold text-green-700">
                Zamówienie gotowe do odbioru
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-3 text-center">
            {order.name && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Nazwa zamówienia:
                </span>
                <p className="mt-1 text-xl font-semibold text-gray-800">
                  {order.name}
                </p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">
                Kod odbioru:
              </span>
              <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-indigo-600">
                {order.code}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Szacowana data odbioru:
              </span>
              <p className="mt-1 text-lg text-gray-700">
                {orderDate.toLocaleString("pl-PL", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {order.isReady && order.readyTime && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Potwierdzona data odbioru:
                </span>
                <p className="mt-1 text-lg font-semibold text-green-700">
                  {new Date(order.readyTime).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => router.push("/show-order")}
          className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
        >
          Zmień kod odbioru
        </button>
      </div>
    </div>
  );
};

export default ShowOrderPage;

