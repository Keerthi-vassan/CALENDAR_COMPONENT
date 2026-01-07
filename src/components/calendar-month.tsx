"use client";

import { useState } from "react";
import { useCalendar } from "@/context/calendar-context";
import { 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  format,
  isWithinInterval,
  startOfDay,
  endOfDay
} from "date-fns";
import { cn } from "@lib/utils";
import AddEventModal from "./add-event-modal"; // Ensure this matches your filename

export default function CalendarMonth() {
  const { currentDate, events, addEvent } = useCalendar();
  
  // 1. Local state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate))
  });

  // 2. Click Handler
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // 3. Save Handler (Connects to Context)
  const handleSaveEvent = ({ title, color, start, end }: { title: string; color: any; start: Date; end: Date }) => {
    addEvent({
      id: crypto.randomUUID(),
      title,
      start,
      end,
      color,
    });
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-1 p-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-sm p-2">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = events.filter((event) => 
            isWithinInterval(day, {
              start: startOfDay(event.start),
              end: endOfDay(event.end)
            })
          );

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)} // <--- Trigger Modal
              className={cn(
                "h-24 border rounded-md p-1 overflow-y-auto flex flex-col gap-1 hover:bg-gray-50 cursor-pointer transition-colors", 
                !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400"
              )}
            >
              <div className={cn(
                "font-semibold text-xs w-6 h-6 flex items-center justify-center rounded-full mb-1",
                isSameDay(day, new Date()) && "bg-black text-white"
              )}>
                {format(day, "d")}
              </div>
              
              {dayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={cn(
                    "text-xs p-1 rounded truncate",
                    event.color === "red" ? "bg-red-100 text-red-700" :
                    event.color === "blue" ? "bg-blue-100 text-blue-700" :
                    event.color === "green" ? "bg-green-100 text-green-700" :
                    event.color === "purple" ? "bg-purple-100 text-purple-700" :
                    "bg-gray-100 text-gray-700"
                  )}
                  title={event.title}
                  onClick={(e) => e.stopPropagation()} // Prevent clicking event from opening "Add Event" modal
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 4. Render the Modal */}
      <AddEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        date={selectedDate}
      />
    </>
  );
}