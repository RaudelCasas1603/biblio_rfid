"use client";
import { useEffect, useState } from "react";

export default function Countdown({ endDate }) {
  const [daysLeft, setDaysLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date();
      const end = new Date(endDate);
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    }, 1000); // actualiza cada segundo

    return () => clearInterval(interval);
  }, [endDate]);

  if (daysLeft === null) return null;

  return (
    <span
      className={`font-semibold ${
        daysLeft < 0
          ? "text-red-600"
          : daysLeft <= 2
          ? "text-yellow-500"
          : "text-green-600"
      }`}>
      {daysLeft < 0
        ? `Vencido hace ${Math.abs(daysLeft)} día(s)`
        : `Faltan ${daysLeft} día(s)`}
    </span>
  );
}
