"use client";

import { useEffect, useState } from "react";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
  CircularProgressValueText,
} from "@/components/ui/circular-progress";

interface OrderTimeProgressProps {
  creationTime: number;
  estReadyTime: number;
  size?: number;
  thickness?: number;
}

export const OrderTimeProgress = ({
  creationTime,
  estReadyTime,
  size = 120,
  thickness = 8,
}: OrderTimeProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = Date.now();
      const totalDuration = estReadyTime - creationTime;
      const elapsed = now - creationTime;

      if (now >= estReadyTime) {
        return 100;
      }

      if (now <= creationTime) {
        return 0;
      }

      const progressPercentage = (elapsed / totalDuration) * 100;
      return Math.min(100, Math.max(0, progressPercentage));
    };

    // Oblicz początkowy progres
    setProgress(calculateProgress());

    // Aktualizuj co sekundę
    const interval = setInterval(() => {
      setProgress(calculateProgress());
    }, 1000);

    return () => clearInterval(interval);
  }, [creationTime, estReadyTime]);

  const remainingTime = estReadyTime - Date.now();
  const isOverdue = remainingTime < 0;

  // Oblicz pozostały czas
  const getRemainingTimeText = () => {
    if (isOverdue)
      return "Upłynął zadeklarowany termin przygotowania zamówienia";

    const totalSeconds = Math.floor(remainingTime / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <CircularProgress
        value={progress}
        max={100}
        size={size}
        thickness={thickness}
      >
        <CircularProgressIndicator>
          <CircularProgressTrack className="text-gray-200 dark:text-green-900" />
          <CircularProgressRange className="text-green-700" />
        </CircularProgressIndicator>
        <CircularProgressValueText className="text-2xl font-semibold text-green-700 dark:text-green-300" />
      </CircularProgress>
      <div className="text-center">
        <p
          className={`text-lg font-semibold ${isOverdue ? "text-red-600" : "text-gray-700"}`}
        >
          {getRemainingTimeText()}
        </p>
      </div>
    </div>
  );
};
