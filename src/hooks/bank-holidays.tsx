import { isSameDay } from "date-fns";
import { createContext, useContext, useEffect, useState } from "react";

interface BankHoliday {
  date: Date;
  title: string;
}

interface BankHolidays {
  "england-and-wales": { events: BankHoliday[] };
  scotland: { events: BankHoliday[] };
  "northern-ireland": { events: BankHoliday[] };
}

class BankHolidaysHelper {
  constructor(private bankHolidays: BankHolidays) {}

  isBankHoliday(
    date: Date,
    location:
      | "england-and-wales"
      | "scotland"
      | "northern-ireland" = "england-and-wales",
  ): boolean {
    const events = this.bankHolidays[location].events;
    return events.some((event) => isSameDay(event.date, date));
  }
}

const BankHolidayContext = createContext<BankHolidaysHelper | null>(null);

export const useBankHolidaysHelper = () => useContext(BankHolidayContext);

const BankHolidayProvider = ({ children }: any) => {
  const [bankHolidaysHelper, setBankHolidaysHelper] =
    useState<BankHolidaysHelper | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch("https://www.gov.uk/bank-holidays.json");
      const json = (await response.json()) as BankHolidays;
      const setDate = (event: any) => ({
        ...event,
        date: new Date(event.date.replace("-", "/")),
      });
      const holidays: BankHolidays = {
        "england-and-wales": {
          events: json["england-and-wales"].events.map(setDate),
        },
        scotland: { events: json["scotland"].events.map(setDate) },
        "northern-ireland": {
          events: json["northern-ireland"].events.map(setDate),
        },
      };
      setBankHolidaysHelper(new BankHolidaysHelper(holidays));
      setLoading(false);
    };

    getData();
  }, []);

  return (
    <BankHolidayContext.Provider value={bankHolidaysHelper}>
      {!loading && children}
    </BankHolidayContext.Provider>
  );
};

export default BankHolidayProvider;
