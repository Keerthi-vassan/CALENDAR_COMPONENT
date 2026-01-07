import React from 'react'
import { useCalendar } from '@/context/calendar-context';
import {format} from 'date-fns';

const CalendarHeader = () => {
  const { currentDate, nextMonth, prevMonth } = useCalendar();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}

        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={prevMonth}
          className="p-2 border rounded hover:bg-gray-100"
        >
          Previous
        </button>

        <button
          onClick={nextMonth}
          className="p-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CalendarHeader;