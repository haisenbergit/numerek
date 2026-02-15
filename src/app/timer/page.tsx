"use client";

import { ChangeEvent, FC, useEffect, useState } from "react";
import ShiftingCountdown from "@/components/shifting-countdown";

const getDefaultCountdownTo = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20);
  // Format to 'YYYY-MM-DDTHH:mm:ss' for datetime-local input
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const Timer: FC = () => {
  const [countdownTo, setCountdownTo] = useState<string>("");
  // Ustaw domyślną wartość tylko po stronie klienta, aby uniknąć różnic SSR/CSR
  useEffect(() => {
    setCountdownTo(getDefaultCountdownTo());
  }, []);

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
            {countdownTo &&
              (() => {
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
