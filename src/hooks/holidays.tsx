import { createContext, useContext, useEffect, useState } from "react";
import { IHoliday, deserialize } from "../types/holiday.interface";
import { useAuth } from "./auth";
import { supabase } from "../utils/supabase";

const HolidaysContext = createContext<{
  holidays: IHoliday[] | null;
  setSelectedYear: (year: number) => void;
  selectedYear: number;
  notSubmittedHolidaysCount: number;
  invalidateCache: () => void;
}>({
  holidays: null,
  setSelectedYear: () => {},
  selectedYear: new Date().getFullYear(),
  notSubmittedHolidaysCount: 0,
  invalidateCache: () => {},
});

export const useHolidays = () => useContext(HolidaysContext);

export default function HolidaysProvider({ children }: any) {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [holidays, setHolidays] = useState<IHoliday[] | null>(null);
  const [notSubmittedHolidaysCount, setNotSubmittedHolidaysCount] = useState(0);
  const [updateCounter, setUpdateCounter] = useState(0);

  const value = {
    holidays,
    setSelectedYear,
    selectedYear,
    notSubmittedHolidaysCount,
    invalidateCache: () => setUpdateCounter((prev) => prev + 1),
  };

  useEffect(() => {
    if (user) {
      const getData = async () => {
        const { data, error } = await supabase.rpc("get_holidays_for_year", {
          user_id: user.id,
          year: selectedYear,
        });
        if (error) {
          console.error(error);
        } else {
          setHolidays(deserialize(data));
        }
      };
      getData();
    }
  }, [user, selectedYear, updateCounter]);

  useEffect(() => {
    if (user) {
      const getData = async () => {
        const { data, error } = await supabase.rpc(
          "get_count_of_holidays_not_submitted_for_user",
          { user_id: user.id },
        );

        if (error) {
          console.log(error);
        } else {
          setNotSubmittedHolidaysCount(data);
        }
      };

      getData();
    }
  }, [user, updateCounter]);

  return (
    <HolidaysContext.Provider value={value}>
      {children}
    </HolidaysContext.Provider>
  );
}
