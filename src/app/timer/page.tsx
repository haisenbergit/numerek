"use client";

import { FC, useState, ChangeEvent } from "react";
import ShiftingCountdown from "@/components/shifting-countdown";

const Timer: FC = () => {
  const [countdownTo, setCountdownTo] = useState<string>("2026-02-14T20:30:00");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setCountdownTo(e.target.value);

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
        <div className="mb-6 flex flex-col items-center gap-2">
          <label htmlFor="countdown-input" className="text-lg font-medium">
            Ustaw datę i godzinę:
          </label>
          <input
            id="countdown-input"
            type="datetime-local"
            className="rounded border px-3 py-2 text-lg"
            value={countdownTo}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
