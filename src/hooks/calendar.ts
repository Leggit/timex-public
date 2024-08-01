import { addDays, getDaysInMonth, isWeekend } from "date-fns";
import { useEffect, useState } from "react";
import { useBankHolidaysHelper } from "./bank-holidays";

// Object to hold information on a day in the calendar
export type MonthCalendarItem = {
  date: Date;
  isInMonth: boolean;
  isBankHoliday: boolean;
  isWeekend: boolean;
};

// The calendar for a month is simply an array of days
export type MonthCalendar = MonthCalendarItem[];

// Hook for creating calendar objects for each month
export function useMonthCalendar(
  year: number,
  month: number,
  includeWeekends = true,
): MonthCalendar {
  const [monthCalendar, setMonthCalendar] = useState<MonthCalendar>([]);
  const bankHolidaysHelper = useBankHolidaysHelper();
  const fiveWeeks = 5 * 7;
  const sixWeeks = 6 * 7;

  // Useeffect means the calendar will update when input parameters change
  useEffect(() => {
    const startOfMonth = new Date(`${year}/${month}/01`);
    const monthLength = getDaysInMonth(startOfMonth);
    const dayOfWeekMonthStartedOn =
      startOfMonth.getDay() - 1 < 0 ? 6 : startOfMonth.getDay() - 1;
    // Calculated the overall length including days from the previous and next months to be shown
    const length =
      dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

    // Create blank array
    const calendar = new Array(length)
      .fill({})
      // Populate each day in the array
      .map((_, index) => {
        const date = addDays(startOfMonth, index - dayOfWeekMonthStartedOn);
        return {
          isInMonth: !(
            index < dayOfWeekMonthStartedOn ||
            index - dayOfWeekMonthStartedOn >= monthLength
          ),
          date,
          isBankHoliday: !!bankHolidaysHelper?.isBankHoliday(date),
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
        };
      })
      // Remove weekends if they are not being shown
      .filter((day) => (includeWeekends ? true : !day.isWeekend));

    setMonthCalendar(calendar);
  }, [year, month, includeWeekends, bankHolidaysHelper]);

  return monthCalendar!;
}
