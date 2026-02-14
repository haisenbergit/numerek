"use client";

import { FC } from "react";
import ShiftingCountdown from "@/components/shifting-countdown";

const Timer: FC = () => {
  // Przykładowa data docelowa (możesz zmienić na dowolną)
  const countdownTo = "2026-06-01";
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Timer</h1>
        <ShiftingCountdown countdownTo={countdownTo} />
      </div>
    </div>
  );
};

export default Timer;
