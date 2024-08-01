import {
  FormLabel,
  Box,
  Grid,
  Chip,
  Typography,
  Switch,
  Input,
  Tooltip,
} from "@mui/joy";
import { shortWeekDays } from "../utils/short-week-days.const";
import { useEffect, useState } from "react";
import { MonthCalendarItem, useMonthCalendar } from "../hooks/calendar";
import { ITimeEntry } from "../types/time-entry.interface";
import { isSameDay } from "date-fns";

const DayPicker = ({
  selectedDate,
  selectionChanged,
  currentTimeEntries,
  error,
}: {
  selectedDate: Date;
  selectionChanged: (days: { [key: number]: number }) => void;
  currentTimeEntries: ITimeEntry[];
  error?: string;
}) => {
  const defaultDailyHours = 7.5;
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [selectedDays, setSelectedDays] = useState<{ [key: number]: number }>(
    {},
  );
  const month = useMonthCalendar(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    includeWeekends,
  );
  const [dragSelectionMode, setDragSelectionMode] = useState<{
    startDay: MonthCalendarItem;
    maxDay: MonthCalendarItem;
  } | null>(null);
  const [showInputs, setShowInputs] = useState(false);

  const toggleSelectedDay = (
    date: Date,
    hours = defaultDailyHours,
    mode?: "select-only" | "unselect-only",
  ) => {
    const dateRef = date.getTime();
    if (selectedDays[dateRef] && mode !== "select-only") {
      delete selectedDays[dateRef];
      setSelectedDays({ ...selectedDays });
    } else {
      setSelectedDays({ ...selectedDays, [dateRef]: hours });
    }
  };

  const selectUpToDay = (day: MonthCalendarItem) => {
    const startIndex = month.indexOf(dragSelectionMode?.startDay!);
    const endIndex = month.indexOf(day);
    const days = month
      .slice(startIndex, endIndex + 1)
      .filter(
        (day) =>
          !day.isBankHoliday &&
          (includeWeekends || !day.isWeekend) &&
          day.isInMonth,
      );
    const newSelectedDays: { [key: number]: number } = {
      ...selectedDays,
      ...days.reduce(
        (acc, curr) => ({ ...acc, [curr.date.getTime()]: defaultDailyHours }),
        {},
      ),
    };

    const maxSelectedIndex = month.indexOf(dragSelectionMode?.maxDay!);
    if (maxSelectedIndex > endIndex) {
      month
        .slice(endIndex, maxSelectedIndex + 1)
        .forEach((day) => delete newSelectedDays[day.date.getTime()]);
    }
    setSelectedDays(newSelectedDays);
    setDragSelectionMode({ ...dragSelectionMode!, maxDay: day });
  };

  const selectAllDays = () => {
    const days = month
      .filter(
        (day) =>
          day.isInMonth &&
          !day.isBankHoliday &&
          day.date.getDay() !== 0 &&
          day.date.getDay() !== 6,
      )
      .reduce(
        (acc, curr) => ({ ...acc, [curr.date.getTime()]: defaultDailyHours }),
        {},
      );
    setSelectedDays(days);
  };

  useEffect(() => {
    selectionChanged(selectedDays);
  }, [selectedDays]);

  const boxContent = ({
    day,
    inInput,
  }: {
    day: MonthCalendarItem;
    inInput?: boolean;
  }) => {
    const hoursAlreadyBooked = currentTimeEntries
      .filter((t) => isSameDay(t.date, day.date))
      .filter((t) => t.holidayStatus !== "CANCELLED")
      .reduce((total, t) => total + t.numberOfHours, 0);
    return (
      <Tooltip
        arrow
        title={
          hoursAlreadyBooked && day.isInMonth
            ? `${hoursAlreadyBooked}h already booked`
            : null
        }>
        <Box
          onMouseDown={() => {
            if (day.isInMonth) {
              toggleSelectedDay(day.date);
              setDragSelectionMode({ startDay: day, maxDay: day });
            }
          }}
          onMouseOver={() => dragSelectionMode && selectUpToDay(day)}
          sx={{
            width: "50%",
            borderRadius: inInput ? "5px 0px 0px 5px" : "5px 5px 5px 5px",
            height: "40px",
            display: "flex",
            justifyContent: showInputs ? "space-between" : "center",
            flexGrow: 1,
            userSelect: "none",
            border: "5px solid",
            borderColor: day.isBankHoliday
              ? "warning.outlinedBorder"
              : "rgba(0,0,0,0)",

            backgroundColor: getBackgroundColor(
              day.isInMonth,
              day.isBankHoliday,
              !!selectedDays[day.date.getTime()],
            ),
            cursor: day.isInMonth ? "pointer" : "auto",
          }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
            <Typography
              sx={{
                fontWeight: day.isInMonth ? "lg" : "md",
                fontSize: includeWeekends ? "12px" : "auto",
                color: getColor(
                  day.isInMonth,
                  day.isBankHoliday,
                  !!selectedDays[day.date.getTime()],
                ),
              }}>
              {day.date.getDate()}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    );
  };

  return (
    <>
      <Box id="selectDays" sx={{ mb: 1 }}>
        <FormLabel sx={{ display: "flex", justifyContent: "space-between" }}>
          Select days{" "}
          <Box sx={{ display: "flex" }}>
            <Tooltip
              placement="top"
              arrow
              title="Specify exact hours for each day">
              <Chip
                color="primary"
                sx={{
                  mr: 1,
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                  width: "50%",
                }}>
                <Typography
                  component="label"
                  fontSize="sm"
                  endDecorator={
                    <Switch
                      checked={showInputs}
                      onChange={(event: any) =>
                        setShowInputs(event.target.checked)
                      }
                      size="sm"
                      sx={{ ml: 1 }}
                    />
                  }>
                  Show inputs
                </Typography>
              </Chip>
            </Tooltip>
            <Chip sx={{ flexGrow: 1, display: "flex", width: "50%" }}>
              <Typography
                component="label"
                fontSize="sm"
                endDecorator={
                  <Switch
                    checked={includeWeekends}
                    onChange={(event: any) =>
                      setIncludeWeekends(event.target.checked)
                    }
                    size="sm"
                    sx={{ ml: 1 }}
                  />
                }>
                Show weekends
              </Typography>
            </Chip>
          </Box>
        </FormLabel>
      </Box>
      <Box
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: error ? "red" : "rgba(0,0,0,0)",
          backgroundColor: "neutral.plainActiveBg",
          borderRadius: "sm",
          padding: 0.5,
        }}>
        <Box
          sx={{
            cursor: dragSelectionMode ? "pointer" : "auto",
            overflow: "hidden",
          }}>
          <Grid
            onMouseLeave={() => setDragSelectionMode(null)}
            onMouseUp={() => setDragSelectionMode(null)}
            container
            columns={includeWeekends ? 7 : 5}
            spacing={1}
            sx={{ flexGrow: 1, padding: 0.5 }}>
            {shortWeekDays.slice(0, includeWeekends ? 7 : 5).map((dayName) => {
              return (
                <Grid xs={1} key={dayName} sx={{ textAlign: "center" }}>
                  {dayName}
                </Grid>
              );
            })}

            {month.map((day, index) => {
              return (
                <Grid
                  xs={1}
                  key={index}
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    padding: "2px",
                  }}>
                  {day.isInMonth && showInputs ? (
                    <Input
                      startDecorator={boxContent({ day, inInput: true })}
                      onInput={(event: any) => {
                        let value = event.target.value;
                        let valueNumber = parseFloat(value);
                        if (value.split(".")[1]?.length > 2) {
                          value = valueNumber.toFixed(2);
                          event.target.value = value;
                          valueNumber = parseFloat(value);
                        }

                        if (value === "0.00") {
                          event.target.value = "0.0";
                        }

                        if (valueNumber > 24) {
                          event.stopPropagation();
                          event.preventDefault();
                          return;
                        }

                        if (!Number.isNaN(valueNumber)) {
                          setSelectedDays({
                            ...selectedDays,
                            [day.date.getTime()]: valueNumber,
                          });
                        } else {
                          event.target.value = "";
                          delete selectedDays[day.date.getTime()];
                          setSelectedDays({ ...selectedDays });
                        }
                      }}
                      sx={{
                        paddingLeft: "0px",
                        border: 0,
                        fontSize: includeWeekends ? "12px" : "auto",
                        ".MuiInput-startDecorator": {
                          width: includeWeekends ? "44%" : "55%",
                          marginRight: includeWeekends ? 0.5 : 0.7,
                        },
                      }}
                      slotProps={{ input: { min: 0, max: 24 } }}
                      value={selectedDays[day.date.getTime()] ?? ""}
                      onMouseDown={(event: any) => event.stopPropagation()}
                      type="number"
                      size="sm"
                    />
                  ) : (
                    boxContent({ day })
                  )}
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <Box sx={{ p: 0.3, mt: 0.5 }}>
          <Box sx={{ display: "flex", width: "100%", flexGrow: 1 }}>
            <Chip
              onClick={() => selectAllDays()}
              variant="solid"
              color="primary"
              size="sm"
              sx={{ mr: 1, flexGrow: 1, display: "flex", width: "50%" }}>
              Select all working days
            </Chip>
            <Chip
              onClick={() => setSelectedDays({})}
              variant="solid"
              color="danger"
              size="sm"
              sx={{ mr: 2, flexGrow: 1, display: "flex", width: "50%" }}>
              Clear selection
            </Chip>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DayPicker;

const getBackgroundColor = (
  isInMonth: boolean,
  isBankHoliday: boolean,
  isSelected: boolean,
) => {
  if (isSelected) {
    return "primary.plainColor";
  }
  if (isBankHoliday) {
    return "warning.softActiveBg";
  }
  if (!isInMonth) {
    return "primary.solidDisabledBg";
  }

  return "#fff";
};

const getColor = (
  isInMonth: boolean,
  isBankHoliday: boolean,
  isSelected: boolean,
) => {
  if (!isInMonth) {
    return "primary.solidDisabledColor";
  }
  if (isSelected) {
    return "#fff";
  }
  return "#000";
};
