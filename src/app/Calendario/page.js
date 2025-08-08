"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { useState } from "react";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import Countdown from "../Components/Countdown";
import ProtectedRoute from "../Components/ProtectedRoute"; // ✅ importa esto

function CalendarAppContent() {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const events = [
    {
      id: "1",
      title: "El Principito - Préstamo",
      start: "2025-07-06",
      end: "2025-07-06",
    },
    {
      id: "2",
      title: "Cien años de soledad - Préstamo",
      start: "2025-08-04",
      end: "2025-08-04",
    },
    {
      id: "3",
      title: "1984 - Préstamo",
      start: "2025-08-08",
      end: "2025-08-08",
    },
    {
      id: "4",
      title: "Harry Potter - Préstamo",
      start: "2025-08-14",
      end: "2025-08-14",
    },
    {
      id: "5",
      title: "La Odisea - Préstamo",
      start: "2025-08-14",
      end: "2025-08-14",
    },
  ];

  const calendar = useNextCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events,
    plugins: [eventsService],
    callbacks: {
      onRender: () => {
        eventsService.getAll();
      },
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-bold text-3xl text-center mb-4">Libros Activos</h1>

      <div className="bg-white rounded-lg shadow-md p-4 h-[500px] overflow-y-auto">
        <ScheduleXCalendar calendarApp={calendar} />
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Libros en préstamo activos
        </h2>
        {events.map((event) => (
          <div
            key={event.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <p className="text-gray-800 text-xl">{event.title}</p>
            <Countdown endDate={event.end} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarApp() {
  return (
    <ProtectedRoute>
      <CalendarAppContent />
    </ProtectedRoute>
  );
}
