"use client";

import { FC } from "react";
import ShiftingCountdown from "@/components/shifting-countdown";

const Timer: FC = () => {
  const countdownTo = "2026-02-14T20:30:00";

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Timer</h1>
        <ShiftingCountdown countdownTo={countdownTo} />
        <div className="mt-4 text-center text-lg text-gray-700">
          Odliczanie do:{" "}
          <span className="font-mono">
            {(() => {
              const d = new Date(countdownTo);
              const pad = (n: number) => n.toString().padStart(2, "0");
              return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
            })()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
