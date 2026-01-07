"use client";

import React,{createContext,useContext,useState,ReactNode} from 'react';
import {addDays, addMonths,subMonths} from 'date-fns';

export interface CalendarEvent{
    id : string;
    title :string ;
    start: Date;
    end : Date;
    orgainizer ?: string;
    description ?: string;
    color ?: "default" | "blue" | "red" | "green" | "yellow" | "purple";
}

interface CalendarContextType{
    currentDate: Date;
    events: CalendarEvent[];
    setCurrentDate: (date:Date) => void;
    addEvent: (event:CalendarEvent) => void;
    nextMonth: () => void;
    prevMonth: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({children}:{children : ReactNode}) => {
  const [currentDate,setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Project Launch 🚀",
      start: new Date(), // Today!
      end: addDays(new Date(),10),
      color: "blue"
    }
  ]);

  const nextMonth = () => setCurrentDate((prev) => addMonths(prev,1));
  const prevMonth = () => setCurrentDate((prev) => subMonths(prev,1));

  const addEvent = (event :CalendarEvent) =>{
    setEvents((prev) => [...prev,event]);
  }

  return (
    <CalendarContext.Provider value={{currentDate, events, setCurrentDate, addEvent , nextMonth , prevMonth}}>

      {children}

    </CalendarContext.Provider>
  );
};

export function useCalendar(){
  const context = useContext(CalendarContext);
  if(!context){
    throw new Error("useCalendar must be use within a CalendarProvider")
  }

  return context;
}

