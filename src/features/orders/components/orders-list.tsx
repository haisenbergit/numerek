"use client";

import Link from "next/link";
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
import { Scroller } from "@/components/ui/scroller";
import { useCloseOrder } from "@/features/orders/api/use-close-order";
import { useGetOrders } from "@/features/orders/api/use-get-orders";
import { useMarkAsDelivered } from "@/features/orders/api/use-mark-as-delivered";
import { useMarkAsReady } from "@/features/orders/api/use-mark-as-ready";

export const OrdersList = () => {
  const { data, isLoading } = useGetOrders();
  const { mutate: closeOrder, isPending: isClosing } = useCloseOrder();
  const { mutate: markAsReady, isPending: isMarkingReady } = useMarkAsReady();
  const { mutate: markAsDelivered, isPending: isMarkingDelivered } =
    useMarkAsDelivered();

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

  const handleMarkAsDelivered = (orderId: string) => {
    markAsDelivered(
      { orderId: orderId as any },
      {
        onSuccess() {
          toast.success("Zamówienie oznaczone jako wydane");
        },
        onError() {
          toast.error("Nie udało się oznaczyć zamówienia jako wydane");
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
            ? (() => {
                const activeCount = data.filter((order) => order.isActive).length;
                return activeCount > 0
                  ? `Masz ${activeCount} ${activeCount === 1 ? "aktywne zamówienie" : "aktywnych zamówień"}`
                  : "Nie masz aktywnych zamówień";
              })()
            : "Nie masz jeszcze żadnych zamówień"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 || data.filter((order) => order.isActive).length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            {!data || data.length === 0
              ? "Utwórz swoje pierwsze zamówienie"
              : "Nie masz aktywnych zamówień"}
          </div>
        ) : (
          <Scroller
            orientation="vertical"
            hideScrollbar={true}
            className="max-h-[600px] pr-2"
            size={20}
          >
            <div className="space-y-3">
              {[...data]
                .filter((order) => order.isActive)
                .sort((a, b) => a.estReadyTime - b.estReadyTime)
                .map((order) => {
              const isReady = order.readyTime !== undefined;
              const isDelivered = order.deliveryTime !== undefined;
              const estimatedReadinessDate = new Date(order.estReadyTime);
              const now = new Date();
              const isPast = estimatedReadinessDate < now;
              const timeDiffMs =
                estimatedReadinessDate.getTime() - now.getTime();
              const minutesRemaining = Math.floor(timeDiffMs / (1000 * 60));
              const formattedDate = estimatedReadinessDate.toLocaleString(
                "pl-PL",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              return (
                <div
                  key={order._id}
                  className={`rounded-lg border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                    order.isActive && isPast 
                      ? "border-2 border-red-500 bg-red-50" 
                      : order.isActive 
                        ? "border-slate-200" 
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      {order.name && (
                        <div className="text-lg font-bold text-gray-900">
                          {order.name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 font-mono text-sm font-semibold text-slate-900">
                        <span className="text-slate-500">Kod:</span>
                        <span>{order.code}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Data odbioru:</span>{" "}
                        {formattedDate}
                      </div>
                      <div
                        className={`rounded-md px-3 py-1.5 text-sm font-semibold ${isDelivered && order.deliveryTime ? "bg-purple-100 text-purple-700" : isReady ? "bg-green-100 text-green-700" : !order.isActive && !isReady ? "bg-red-100 text-red-700" : isPast ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                      >
                        {isDelivered && order.deliveryTime
                          ? `Wydane: ${new Date(
                              order.deliveryTime
                            ).toLocaleString("pl-PL", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : isReady && order.readyTime
                            ? `Gotowe od: ${new Date(
                                order.readyTime
                              ).toLocaleString("pl-PL", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`
                            : !order.isActive && !isReady
                              ? "Nie wydano"
                              : isPast
                                ? `Opóźnienie: ${Math.abs(minutesRemaining)} min`
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
                            {isReady && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                Gotowe
                              </span>
                            )}
                            {isDelivered && (
                              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                Wydane
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/show-order-by-timeline/${order._id}`}
                            className="w-full"
                          >
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full text-xs"
                            >
                              Pokaż zamówienie
                            </Button>
                          </Link>
                          {!isReady && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkAsReady(order._id)}
                              disabled={isMarkingReady}
                              className="w-full text-xs"
                            >
                              Do odbioru
                            </Button>
                          )}
                          {isReady && !isDelivered && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleMarkAsDelivered(order._id)}
                              disabled={isMarkingDelivered}
                              className="w-full bg-purple-600 text-xs hover:bg-purple-700"
                            >
                              Wydane
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCloseOrder(order._id)}
                            disabled={isClosing}
                            className="w-full text-xs"
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
          </Scroller>
        )}
      </CardContent>
    </Card>
  );
};
