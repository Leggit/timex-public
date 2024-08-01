import { Box, Grid } from "@mui/joy";
import Day from "./Day";
import { MonthCalendar, MonthCalendarItem } from "../hooks/calendar";
import { shortWeekDays } from "../utils/short-week-days.const";
import { useEffect, useState } from "react";
import { ITimeEntry } from "../types/time-entry.interface";
import { format, isSameDay, isSameMonth } from "date-fns";
import MonthSummary from "./MonthSummary";

export default function Timesheet(props: {
  month: MonthCalendar;
  showIncompleteDays: boolean;
  showTimeEntryModal: boolean;
  closeTimeEntryModal: () => any;
  selectionMode: boolean;
  toggleTimeEntrySelected: (timeEntry: ITimeEntry) => any;
  selectedTimeEntries: ITimeEntry[];
  updateCounter: number;
  allTimeEntriesForPage: ITimeEntry[];
  loading: boolean;
}) {
  const [timeEntriesMap, setTimeEntriesMap] = useState<
    Map<string, ITimeEntry[]>
  >(new Map());
  const [allTimeEntriesForMonth, setAllTimeEntriesForMonth] = useState<
    ITimeEntry[]
  >([]);
  const [weeks, setWeeks] = useState<MonthCalendarItem[][]>([[]]);

  useEffect(() => {
    const map = new Map<string, ITimeEntry[]>();
    props.month.forEach((day) => {
      const key = format(day.date, "yyyy-MM-dd");
      map.set(
        key,
        props.allTimeEntriesForPage.filter((item) =>
          isSameDay(day.date, item.date),
        ),
      );
    });

    const monthDate = props.month.find((item) => item.isInMonth)?.date;
    setAllTimeEntriesForMonth(
      props.allTimeEntriesForPage.filter((entry) =>
        isSameMonth(entry.date, monthDate!),
      ),
    );
    setTimeEntriesMap(map);
  }, [props.allTimeEntriesForPage]);

  useEffect(() => {
    setWeeks(
      props.month.reduce(
        (acc, current) => {
          if (acc.at(-1)?.length === 7) {
            acc.push([]);
          }
          acc.at(-1)?.push(current);
          return acc;
        },
        [[]] as MonthCalendarItem[][],
      ),
    );
  }, [props.month]);

  const getCornerValue = (index: number, week: number) => {
    if (week === 0) {
      if (index === 0) {
        return "top-left";
      }
      if (index === 6) {
        return "top-right";
      }
    }
    if (week === weeks.length - 1) {
      if (index === 0) {
        return "bottom-left";
      }
      if (index === 6) {
        return "bottom-right";
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          pb: {
            xs: 20,
            sm: 10,
          },
        }}>
        <Grid container columns={7} spacing={0.2}>
          {shortWeekDays.map((dayName) => {
            return (
              <Grid
                sx={{
                  display: { xs: "none", sm: "block" },
                  height: "fit-content",
                }}
                xs={1}
                key={dayName}>
                {dayName}
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ flexGrow: 1, flexDirection: "column", display: "flex" }}>
          {timeEntriesMap &&
            weeks.map((days, week) => {
              return (
                <Box
                  key={week}
                  sx={{
                    flex: "1 1 0%",
                    position: "relative",
                    display: "flex",
                  }}>
                  <Grid
                    container
                    columns={7}
                    spacing={0}
                    sx={{
                      position: { xs: "", sm: "absolute" },
                      width: "100%",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                    }}>
                    {days.map((day, index) => {
                      return (
                        <Grid
                          xs={7}
                          sm={1}
                          key={index}
                          sx={{
                            display: {
                              xs: day.isInMonth ? "block" : "none",
                              sm: "block",
                            },
                          }}>
                          <Day
                            showProgressBar={props.loading}
                            selectedTimeEntries={props.selectedTimeEntries}
                            selectionMode={props.selectionMode}
                            selectTimeEntry={(timeEntry) =>
                              props.toggleTimeEntrySelected(timeEntry)
                            }
                            timeEntries={
                              timeEntriesMap.get(
                                format(day.date, "yyyy-MM-dd"),
                              ) ?? []
                            }
                            date={day.date}
                            disabled={!day.isInMonth}
                            isWeekend={
                              day.date.getDay() === 0 ||
                              day.date.getDay() === 6 ||
                              day.isBankHoliday
                            }
                            corner={getCornerValue(index, week)}
                            showIncompleteDays={props.showIncompleteDays}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            })}
        </Box>
      </Box>

      <MonthSummary month={props.month} timeEntries={allTimeEntriesForMonth} />
    </>
  );
}
