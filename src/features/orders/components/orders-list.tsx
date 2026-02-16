"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCloseOrder } from "@/features/orders/api/use-close-order";
import { useGetOrders } from "@/features/orders/api/use-get-orders";
import { useMarkAsReady } from "@/features/orders/api/use-mark-as-ready";

export const OrdersList = () => {
  const { data, isLoading } = useGetOrders();
  const { mutate: closeOrder, isPending: isClosing } = useCloseOrder();
  const { mutate: markAsReady, isPending: isMarkingReady } = useMarkAsReady();

  const handleCloseOrder = (orderId: string) => {
    closeOrder(
      { orderId: orderId as any },
      {
        onSuccess() {
          toast.success("Zamówienie zostało zamknięte");
        },
        onError() {
          toast.error("Nie udało się zamknąć zamówienia");
        },
      }
    );
  };

  const handleMarkAsReady = (orderId: string) => {
    markAsReady(
      { orderId: orderId as any },
      {
        onSuccess() {
          toast.success("Zamówienie oznaczone jako gotowe do odbioru");
        },
        onError() {
          toast.error("Nie udało się oznaczyć zamówienia");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Twoje zamówienia</CardTitle>
          <CardDescription>
            Lista wszystkich utworzonych zamówień
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Twoje zamówienia</CardTitle>
        <CardDescription>
          {data && data.length > 0
            ? `Masz ${data.length} ${data.length === 1 ? "zamówienie" : "zamówień"}`
            : "Nie masz jeszcze żadnych zamówień"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            Utwórz swoje pierwsze zamówienie
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((order) => {
              const orderDate = new Date(order.orderTime);
              const now = new Date();
              const isPast = orderDate < now;
              const timeDiffMs = orderDate.getTime() - now.getTime();
              const minutesRemaining = Math.floor(timeDiffMs / (1000 * 60));
              const formattedDate = orderDate.toLocaleString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={order._id}
                  className={`rounded-lg border p-4 transition-colors ${
                    isPast ? "border-2 border-red-500" : "" //TODO: pokazywać rzeczywiste spóźnienie, a nie tylko czerwony kolor
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      {order.name && (
                        <div className="text-base font-semibold text-gray-900">
                          {order.name}
                        </div>
                      )}
                      <div className="font-mono text-sm font-semibold">
                        Kod odbioru: {order.code}
                      </div>
                      <div className="text-sm text-slate-600">
                        Data odbioru: {formattedDate}
                      </div>
                      <div
                        className={`text-sm font-medium ${order.isReady ? "text-green-600" : !order.isActive && !order.isReady ? "text-red-600" : isPast ? "text-red-600" : "text-blue-600"}`}
                      >
                        {order.isReady && order.readyTime
                          ? `Gotowe od: ${new Date(order.readyTime).toLocaleString("pl-PL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : !order.isActive && !order.isReady
                            ? "Nie wydano"
                            : isPast
                              ? `Spóźnienie: ${Math.abs(minutesRemaining)} min`
                              : `Do odbioru za: ${minutesRemaining} min`}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {order.isActive ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Aktywne
                            </span>
                            {order.isReady && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                Gotowe
                              </span>
                            )}
                          </div>
                          {!order.isReady && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkAsReady(order._id)}
                              disabled={isMarkingReady}
                              className="text-xs"
                            >
                              Do odbioru
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCloseOrder(order._id)}
                            disabled={isClosing}
                            className="text-xs"
                          >
                            Zamknij
                          </Button>
                        </>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                          Zamknięte
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
