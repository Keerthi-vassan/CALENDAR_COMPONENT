"use client";

import { useState } from "react";
import { useCalendar } from "@/context/calendar-context";
import {eachDayOfInterval,startOfMonth, endOfMonth,startOfWeek,endOfWeek,isSameMonth,isSameDay,format,isWithinInterval,startOfDay,endOfDay} from "date-fns";
import { cn } from "@lib/utils";
import AddEventModal from "./add-event-modal";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarMonth() {
   const { currentDate, events, addEvent } = useCalendar();

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

   const days = eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentDate)),
      end: endOfWeek(endOfMonth(currentDate))
   });

   const handleDayClick = (day: Date) => {
      setSelectedDate(day);
      setIsModalOpen(true);
   };

   const handleSaveEvent = ({ title, color, start, end }: { title: string; color: any; start: Date; end: Date }) => {
      addEvent({
         id: crypto.randomUUID(),
         title,
         start,
         end,
         color,
      });
   };

   const variants = {
      enter: { opacity: 0, x: 20 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
   };

   return (
      <>
         <div className="p-2 overflow-hidden w-full">
            <AnimatePresence mode="wait">
               <motion.div
                  key={currentDate.toString()}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  // RESTORED: No background color, just borders
                  className="grid grid-cols-7 border-t border-l w-full"
               >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                     // RESTORED: Removed bg-white
                     <div key={day} className="text-center font-bold text-sm p-2 border-b border-r">
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

                     // LOGIC FIX 1: Stable Sort to prevent jumping
                     dayEvents.sort((a, b) => {
                        const timeDiff = a.start.getTime() - b.start.getTime();
                        if (timeDiff !== 0) return timeDiff;
                        return a.title.localeCompare(b.title);
                     });

                     return (
                        <div key={day.toString()} onClick={() => handleDayClick(day)}

                           className={cn(
                              "h-28 border-b border-r flex flex-col gap-1 hover:bg-gray-50/30 cursor-pointer transition-colors",
                              !isSameMonth(day, currentDate) && "bg-gray-50 text-gray-400"
                           )}
                        >

                           <div className={cn("font-semibold text-xs w-6 h-6 flex items-center justify-center rounded-full m-1", isSameDay(day, new Date()) && "bg-black text-white")}>
                              {format(day, "d")}
                           </div>

                           <div className="flex flex-col gap-1">
                              {dayEvents.slice(0, 2).map((event) => {
                                 const isStart = isSameDay(day, startOfDay(event.start));
                                 const isEnd = isSameDay(day, endOfDay(event.end));
                                 const isSunday = day.getDay() === 0;
                                 const showTitle = isStart || isSunday;

                                 return (
                                    <div key={event.id}
                                       // LOGIC FIX 3: Added 'h-5' (fixed height) to force alignment
                                       className={cn(
                                          "text-xs px-2 py-0.5 truncate text-white h-5",
                                          isStart && isEnd ? "rounded-md mx-2" :
                                             isStart ? "rounded-l-md ml-2 mr-0" :
                                                isEnd ? "rounded-r-md mr-2 ml-0" :
                                                   "rounded-none mx-0"
                                       )}
                                       style={{ backgroundColor: event.color }}
                                       title={event.title}
                                       onClick={(e) => e.stopPropagation()}
                                    >
                                       {/* LOGIC FIX 4: Invisible text instead of no text */}
                                       <span className={cn("leading-tight", showTitle ? "" : "invisible")}>
                                          {event.title}
                                       </span>
                                    </div>
                                 );
                              })}
                           </div>

                           {dayEvents.length > 2 && (
                              <div className="text-xs flex justify-end pr-2 text-gray-500 font-medium">
                                 +{dayEvents.length - 2} more
                              </div>
                           )}
                        </div>
                     );
                  })}
               </motion.div>
            </AnimatePresence>
         </div>

         <AddEventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveEvent}
            date={selectedDate}
         />
      </>
   );
}