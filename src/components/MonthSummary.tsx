import { Box, Card, Typography } from "@mui/joy";
import { ITimeEntry } from "../types/time-entry.interface";
import { MonthCalendar } from "../hooks/calendar";

const MonthSummary = ({
  timeEntries,
  month,
}: {
  timeEntries: ITimeEntry[];
  month: MonthCalendar;
}) => {
  const expectedHoursPerDay = 7.5;
  const expectedTime =
    month.filter((day) => !day.isBankHoliday && !day.isWeekend && day.isInMonth)
      .length * expectedHoursPerDay;
  const totalTimeBooked = timeEntries
    .filter((item) => !item.isOvertime)
    .reduce((total, current) => total + current.numberOfHours, 0);
  const totalTimeLeftToBook = expectedTime - totalTimeBooked;
  const totalOvertimeBooked = timeEntries
    .filter((item) => item.isOvertime)
    .reduce((total, current) => total + current.numberOfHours, 0);

  const item = (label: string, value: any) => (
    <>
      <Box
        sx={{
          display: "flex",
          padding: 0.5,
          marginBottom: { md: 0, sm: 0 },
        }}>
        <Typography
          variant="plain"
          level="body-sm"
          sx={{
            marginRight: 1,
            marginTop: "0.2em",
            textWrap: "nowrap",
            flexGrow: 1,
          }}>
          {label}
        </Typography>
        <Typography
          variant="outlined"
          sx={{
            minWidth: 80,
            padding: "1px",
            paddingX: 1,
            borderRadius: "sm",
            marginRight: { xs: 0, sm: 3 },
            backgroundColor: "background.body",
          }}>
          {value}
        </Typography>
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        mb: 0,
        width: "100%",
        zIndex: 999,
      }}>
      <Box sx={{ padding: { xs: 0, sm: 2 } }}>
        <Card variant="soft" sx={{ padding: 0.5 }}>
          <Box
            sx={{
              display: { md: "flex", flexWrap: "wrap" },
              justifyContent: "flex-start",
            }}>
            {item("Expected standard time", expectedTime)}

            {item("Total time booked", totalTimeBooked)}

            {item("Total time left to book", totalTimeLeftToBook)}

            {item("Overtime", totalOvertimeBooked)}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default MonthSummary;
