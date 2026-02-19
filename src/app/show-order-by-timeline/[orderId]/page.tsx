"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellRing,
  CheckCircle,
  Handshake,
  Hourglass,
  Loader2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { OrderTimeProgress } from "@/components/order-time-progress";
import { Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineDot, TimelineHeader, TimelineItem, TimelineTime, TimelineTitle } from "@/components/ui/timeline";
import { useGetOrderById } from "@/features/orders/api/use-get-order-by-id";
import { useTurnOffSound } from "@/features/orders/api/use-turn-off-sound";
import { voiceoverPackMaleReadySound } from "@/lib/voiceover-pack-male-ready";
import { useOrderId } from "@/hooks/use-order-id";
import { useSound } from "@/hooks/use-sound";

const ShowOrderByTimelinePage = () => {
  const router = useRouter();
  const orderId = useOrderId();
  const { data: order, isLoading } = useGetOrderById(orderId);
  const { mutate: turnOffSound } = useTurnOffSound();
  const previousReadyTimeRef = useRef<number | undefined>(undefined);
  const [soundIntervalId, setSoundIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [playSound, { stop: stopSound }] = useSound(
    voiceoverPackMaleReadySound,
    {
      volume: 1,
      interrupt: true,
    }
  );

  const startLoopingSound = useCallback(() => {
    if (soundIntervalId) return;

    playSound();
    const intervalId = setInterval(() => {
      playSound();
    }, 2000);

    setSoundIntervalId(intervalId);
  }, [soundIntervalId, playSound]);

  const stopLoopingSound = useCallback(() => {
    if (soundIntervalId) {
      clearInterval(soundIntervalId);
      setSoundIntervalId(null);
    }
    stopSound();

    turnOffSound({ orderId });
  }, [soundIntervalId, stopSound, turnOffSound, orderId]);

  useEffect(() => {
    if (!isLoading && !order) {
      toast.error("Nie znaleziono zamówienia");
      router.push("/show-order-by-timeline");
    }
  }, [order, isLoading, router]);

  useEffect(() => {
    if (order && order.readyTime !== undefined && previousReadyTimeRef.current === undefined) {
      if (!order.turnOffSoundTime) {
        startLoopingSound();
      }
    }
    previousReadyTimeRef.current = order?.readyTime;
  }, [order?.readyTime, order, startLoopingSound]);

  useEffect(() => {
    return () => {
      if (soundIntervalId) {
        clearInterval(soundIntervalId);
      }
    };
  }, [soundIntervalId]);

  const activeIndex = useMemo(() => {
    if (!order) return 0;
    if (!order.isActive) return 4;
    if (order.deliveryTime !== undefined) return 3;
    if (order.readyTime !== undefined && order.turnOffSoundTime) return 2;
    if (order.readyTime !== undefined) return 1;
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

  const isReady = order.readyTime !== undefined;
  const isDelivered = order.deliveryTime !== undefined;
  const creationDate = new Date(order._creationTime);
  const estReadyTime = new Date(order.estReadyTime);
  const readyDate = order.readyTime ? new Date(order.readyTime) : null;
  const deliveryDate = order.deliveryTime ? new Date(order.deliveryTime) : null;

  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-gray-50 p-4 py-8">
      <div className="w-full max-w-2xl">

        {!isReady && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-center text-lg font-semibold text-gray-800">
              Postęp realizacji
            </h3>
            <div className="flex justify-center">
              <OrderTimeProgress
                creationTime={order._creationTime}
                estReadyTime={order.estReadyTime}
                size={140}
                thickness={10}
              />
            </div>
          </div>
        )}

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
              <TimelineDot className="border-green-700 bg-green-700">
                <CheckCircle className="h-5 w-5 text-white" />
              </TimelineDot>
              <TimelineConnector
                className={isReady ? "!bg-green-700" : ""}
              />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className="text-green-700">
                    Utworzono zamówienie #{order.code}
                  </TimelineTitle>
                  {order.name && (
                    <TimelineDescription className="text-green-700">
                      Dotyczy: <strong>{order.name}</strong>
                    </TimelineDescription>
                  )}
                </TimelineHeader>
                <TimelineTime
                  dateTime={creationDate.toISOString()}
                  className="mt-2 text-green-700"
                >
                  Czas utworzenia:{" "}
                  <strong>
                    {creationDate.toLocaleString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot
                className={isReady ? "border-green-700 bg-green-700" : ""}
              >
                {isReady ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <Hourglass className="h-5 w-5" />
                )}
              </TimelineDot>
              <TimelineConnector
                className={isReady ? "!bg-green-700" : ""}
              />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className={isReady ? "text-green-700" : ""}>
                    {isReady
                      ? "Zamówienie gotowe"
                      : "Oczekiwanie na realizację"}
                  </TimelineTitle>
                  <TimelineDescription
                    className={isReady ? "text-green-700" : ""}
                  >
                    {isReady
                      ? "Zamówienie zrealizowane i jest gotowe do odbioru"
                      : "Zamówienie jest w trakcie przygotowania"}
                  </TimelineDescription>
                </TimelineHeader>
                <TimelineTime
                  dateTime={
                    readyDate
                      ? readyDate.toISOString()
                      : estReadyTime.toISOString()
                  }
                  className={isReady ? "mt-2 text-green-700" : "mt-2"}
                >
                  {isReady && readyDate ? (
                    <>
                      Gotowe:{" "}
                      <strong>
                        {readyDate.toLocaleString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </>
                  ) : (
                    <>
                      Szacowany czas odbioru:{" "}
                      <strong>
                        {estReadyTime.toLocaleString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                    </>
                  )}
                </TimelineTime>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot
                className={isReady && order.turnOffSoundTime ? "border-green-700 bg-green-700" : isReady ? "border-green-700 bg-green-700" : ""}
              >
                {isReady && order.turnOffSoundTime ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : isReady ? (
                  <BellRing className="h-5 w-5 text-white" />
                ) : (
                  <BellRing className="h-5 w-5" />
                )}
              </TimelineDot>
              <TimelineConnector
                className={isDelivered ? "!bg-green-700" : ""}
              />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle className={isReady && order.turnOffSoundTime ? "text-green-700" : isReady ? "text-green-700" : ""}>
                    {isReady && order.turnOffSoundTime
                      ? "Powiadomienie wyciszone"
                      : isReady
                      ? "Oczekiwanie na powiadomienie"
                      : "Oczekiwanie na powiadomienie"}
                  </TimelineTitle>
                  <TimelineDescription
                    className={isReady && order.turnOffSoundTime ? "text-green-700" : isReady ? "text-green-700" : ""}
                  >
                    {isReady && order.turnOffSoundTime
                      ? "Powiadomienie dźwiękowe o możliwości odbioru wyciszone przez klienta"
                      : isReady
                      ? "Wycisz powiadomienie dźwiękowe o możliwości odbioru zamówienia"
                      : "Oczekiwanie na wyciszenie powiadomienia"}
                  </TimelineDescription>
                </TimelineHeader>
                {isReady && order.turnOffSoundTime && (
                  <TimelineTime
                    dateTime={new Date(order.turnOffSoundTime).toISOString()}
                    className="mt-2 text-green-700"
                  >
                    Wyciszono:{" "}
                    <strong>
                      {new Date(order.turnOffSoundTime).toLocaleString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
                  </TimelineTime>
                )}
                {isReady && soundIntervalId && !order.turnOffSoundTime && (
                  <button
                    onClick={stopLoopingSound}
                    className="relative mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 before:absolute before:inset-[12.5%] before:rounded-lg before:bg-green-700 before:animate-[ping_2s_ease-in-out_infinite] "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <VolumeX className="h-4 w-4" />
                      Wycisz
                    </span>
                  </button>
                )}
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineDot
                className={isDelivered ? "border-green-700 bg-green-700" : ""}
              >
                {isDelivered ? (
                  <CheckCircle className="h-5 w-5 text-white" />
                ) : (
                  <Handshake className="h-5 w-5" />
                )}
              </TimelineDot>
              <TimelineConnector
                className={
                  isDelivered && !order.isActive ? "!bg-green-700" : ""
                }
              />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle
                    className={isDelivered ? "text-green-700" : ""}
                  >
                    {isDelivered
                      ? "Zamówienie oderbane"
                      : "Oczekiwanie na odbiór"}
                  </TimelineTitle>
                  <TimelineDescription
                    className={isDelivered ? "text-green-700" : ""}
                  >
                    {isDelivered
                      ? "Zamówienie zostało oderbane przez klienta"
                      : "Zamówienie jeszcze nie oderbane przez klienta"}
                  </TimelineDescription>
                </TimelineHeader>
                {isDelivered && deliveryDate && (
                  <TimelineTime
                    dateTime={deliveryDate.toISOString()}
                    className="mt-2 text-green-700"
                  >
                    Wydane:{" "}
                    <strong>
                      {deliveryDate.toLocaleString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
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
