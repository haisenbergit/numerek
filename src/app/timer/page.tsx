"use client";

import { FC } from "react";
import ShiftingCountdown from "@/components/shifting-countdown";

const Timer: FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Timer</h1>
        <ShiftingCountdown />
      </div>
    </div>
  );
};

export default Timer;
