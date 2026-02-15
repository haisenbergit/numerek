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
  // Oblicz liczbę dni i godzin do końca, aby warunkowo renderować pola Day i Hour
  const end = new Date(countdownTo);
  const now = new Date();
  const distance = +end - +now;
  const days = Math.floor(distance / DAY);
  const hours = Math.floor((distance % DAY) / HOUR);

  // Zmienna do kontroli liczby kolumn
  const showDays = days > 0;
  const showHours = showDays || hours > 0;
  const visibleUnits: Units[] = [
    ...(showDays ? ["Day" as const] : []),
    ...(showHours ? ["Hour" as const] : []),
    "Minute" as const,
    "Second" as const,
  ];

  // Dynamiczna szerokość okna na podstawie liczby kolumn
  // Jeśli są tylko 2 kolumny (Minute, Second) – szerokość 1/2 oryginalnej ramki
  // W przeciwnym razie – pełna szerokość
  const widthClass =
    visibleUnits.length === 2 ? "max-w-xl w-1/2" : "max-w-5xl w-full";

  return (
    <div className="rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 p-4">
      <div
        className={`mx-auto flex ${widthClass} items-center overflow-hidden rounded-lg bg-white [&>*:last-child]:border-r-0`}
      >
        {visibleUnits.map((unit, idx) => (
          <CountdownItem
            key={unit}
            unit={unit}
            text={
              unit.toLowerCase() +
              (unit === "Day"
                ? "s"
                : unit === "Hour"
                  ? "s"
                  : unit === "Minute"
                    ? "s"
                    : "s")
            }
            countdownTo={countdownTo}
            isLast={idx === visibleUnits.length - 1}
            columns={visibleUnits.length}
          />
        ))}
      </div>
    </div>
  );
};

const CountdownItem = ({
  unit,
  text,
  countdownTo,
  isLast,
  columns,
}: {
  unit: Units;
  text: string;
  countdownTo: string | Date;
  isLast?: boolean;
  columns?: number;
}) => {
  const { ref, time } = useTimer(unit, countdownTo);
  // Dynamiczna szerokość i border dla ostatniej kolumny
  const widthClass =
    columns === 4 ? "w-1/4" : columns === 3 ? "w-1/3" : "w-1/2";
  const borderClass = isLast ? "border-r-0" : "border-r-[1px] border-slate-200";

  return (
    <div
      className={`flex h-24 ${widthClass} flex-col items-center justify-center gap-1 ${borderClass} font-mono md:h-36 md:gap-2`}
    >
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
    else if (unit === "Minute")
      newTime = Math.floor((distance % HOUR) / MINUTE);
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
