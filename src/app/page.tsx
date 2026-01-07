"use client";

import CalendarHeader from "@components/calendar-header";
import CalendarMonth from "@components/calendar-month";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <div className="border rounded-lg shadow-sm">
          <CalendarHeader />
        

          <CalendarMonth />
        </div>
      </div>
    </div>
  );
}