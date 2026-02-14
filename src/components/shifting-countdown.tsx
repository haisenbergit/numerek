import { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type Units = "Day" | "Hour" | "Minute" | "Second";

type ShiftingCountdownProps = {
  countdownTo: string | Date;
};

const ShiftingCountdown = ({ countdownTo }: ShiftingCountdownProps) => {
  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-4">
      <div className="mx-auto flex w-full max-w-5xl items-center bg-white">
        <CountdownItem unit="Day" text="days" countdownTo={countdownTo} />
        <CountdownItem unit="Hour" text="hours" countdownTo={countdownTo} />
        <CountdownItem unit="Minute" text="minutes" countdownTo={countdownTo} />
        <CountdownItem unit="Second" text="seconds" countdownTo={countdownTo} />
      </div>
    </div>
  );
};

const CountdownItem = ({ unit, text, countdownTo }: { unit: Units; text: string; countdownTo: string | Date }) => {
  const { ref, time } = useTimer(unit, countdownTo);

  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-medium text-black md:text-4xl lg:text-6xl xl:text-7xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
        {text}
      </span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations

const useTimer = (unit: Units, countdownTo: string | Date) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current || undefined);
  }, [countdownTo]);

  const handleCountdown = async () => {
    const end = new Date(countdownTo);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;
    if (unit === "Day") newTime = Math.floor(distance / DAY);
    else if (unit === "Hour") newTime = Math.floor((distance % DAY) / HOUR);
    else if (unit === "Minute") newTime = Math.floor((distance % HOUR) / MINUTE);
    else newTime = Math.floor((distance % MINUTE) / SECOND);
    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};
