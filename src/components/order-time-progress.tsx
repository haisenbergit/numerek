"use client";

import { useEffect, useState } from "react";
import { CircularProgressCombined } from "@/components/ui/circular-progress";

interface OrderTimeProgressProps {
  creationTime: number;
  orderTime: number;
  size?: number;
  thickness?: number;
}

export const OrderTimeProgress = ({
  creationTime,
  orderTime,
  size = 120,
  thickness = 8,
}: OrderTimeProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const now = Date.now();
      const totalDuration = orderTime - creationTime;
      const elapsed = now - creationTime;

      if (now >= orderTime) {
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
  }, [creationTime, orderTime]);

  const remainingTime = orderTime - Date.now();
  const isOverdue = remainingTime < 0;

  // Oblicz pozostały czas
  const getRemainingTimeText = () => {
    if (isOverdue) return "Termin minął";

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
      <CircularProgressCombined
        value={progress}
        max={100}
        size={size}
        thickness={thickness}
        className={isOverdue ? "text-red-600" : "text-green-600"}
      />
      <div className="text-center">
        <p className={`text-lg font-semibold ${isOverdue ? "text-red-600" : "text-gray-700"}`}>
          {getRemainingTimeText()}
        </p>
        <p className="text-sm text-gray-500">
          {isOverdue ? "do realizacji" : "pozostało"}
        </p>
      </div>
    </div>
  );
};

