"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "@/components/ui/timeline";
import { useGetOrderById } from "@/features/orders/api/use-get-order-by-id";
import { useOrderId } from "@/hooks/use-order-id";

const ShowOrderByTimelinePage = () => {
  const router = useRouter();
  const orderId = useOrderId();
  const { data: order, isLoading } = useGetOrderById(orderId);

  useEffect(() => {
    if (!isLoading && !order) {
      toast.error("Nie znaleziono aktywnego zamówienia");
      router.push("/show-order-by-timeline");
    }
  }, [order, isLoading, router]);

  const activeIndex = useMemo(() => {
    if (!order) return 0;
    if (!order.isActive) return 2;
    if (order.isReady) return 1;
    return 0;
  }, [order]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!order) return null;

  const creationDate = new Date(order._creationTime);
  const orderDate = new Date(order.orderTime);
  const readyDate = order.readyTime ? new Date(order.readyTime) : null;

  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-gray-50 p-4 py-8">
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
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-3 text-center">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Kod odbioru:
              </span>
              <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-indigo-600">
                {order.code}
              </p>
            </div>
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
          </div>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold text-gray-800">
            Historia zamówienia
          </h3>

          <Timeline
            activeIndex={activeIndex}
            className="pl-4"
            style={{ "--timeline-dot-size": "2rem" } as React.CSSProperties}
          >
            <TimelineItem>
              <TimelineDot className="border-green-500 bg-green-500">
                <Package className="h-5 w-5 text-white" />
              </TimelineDot>
              <TimelineConnector className={order.isReady ? "!bg-green-500" : ""} />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className="text-green-600">Utworzenie zamówienia</TimelineTitle>
                  <TimelineDescription className="text-green-600">
                    Zamówienie zostało zarejestrowane w systemie
                  </TimelineDescription>
                </TimelineHeader>
                <TimelineTime
                  dateTime={creationDate.toISOString()}
                  className="mt-2 text-green-600"
                >
                  {creationDate.toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot className={order.isReady ? "border-green-500 bg-green-500" : ""}>
                {order.isReady ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <Package className="h-5 w-5" />
                )}
              </TimelineDot>
              <TimelineConnector className={order.isReady && !order.isActive ? "!bg-green-500" : ""} />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className={order.isReady ? "text-green-600" : ""}>
                    {order.isReady
                      ? "Zamówienie gotowe do odbioru"
                      : "Oczekiwanie na realizację"}
                  </TimelineTitle>
                  <TimelineDescription className={order.isReady ? "text-green-600" : ""}>
                    {order.isReady
                      ? "Zamówienie zostało zrealizowane i jest gotowe"
                      : "Zamówienie jest w trakcie realizacji"}
                  </TimelineDescription>
                </TimelineHeader>
                <TimelineTime
                  dateTime={
                    readyDate ? readyDate.toISOString() : orderDate.toISOString()
                  }
                  className={order.isReady ? "mt-2 text-green-600" : "mt-2"}
                >
                  {order.isReady && readyDate ? (
                    <>
                      Gotowe:{" "}
                      {readyDate.toLocaleString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    <>
                      Szacowany czas:{" "}
                      {orderDate.toLocaleString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot className={!order.isActive ? "border-green-500 bg-green-500" : ""}>
                {!order.isActive ? (
                  <XCircle className="h-5 w-5 text-white" />
                ) : (
                  <Package className="h-5 w-5" />
                )}
              </TimelineDot>
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className={!order.isActive ? "text-green-600" : ""}>
                    {!order.isActive
                      ? "Zamówienie zamknięte"
                      : "Oczekiwanie na zamknięcie"}
                  </TimelineTitle>
                  <TimelineDescription className={!order.isActive ? "text-green-600" : ""}>
                    {!order.isActive
                      ? "Zamówienie zostało odebrane i zamknięte"
                      : "Zamówienie nie zostało jeszcze zamknięte"}
                  </TimelineDescription>
                </TimelineHeader>
                {!order.isActive && (
                  <TimelineTime className="mt-2 text-green-600">
                    Zamknięte
                  </TimelineTime>
                )}
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        <button
          onClick={() => router.push("/show-order-by-timeline")}
          className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
        >
          Zmień kod odbioru
        </button>
      </div>
    </div>
  );
};

export default ShowOrderByTimelinePage;


