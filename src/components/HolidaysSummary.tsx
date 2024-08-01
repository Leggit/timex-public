import { Box, Card, Typography } from "@mui/joy";
import { useHolidays } from "../hooks/holidays";
import { isAfter } from "date-fns";

export default function HolidaySummary() {
  const holidayEntitlement = 28;
  const { holidays } = useHolidays();
  const takenHolidays = holidays
    ? holidays
        .filter((h) => h.status === "TAKEN")
        .reduce(
          (total, current) =>
            total +
            current.timeEntries.reduce(
              (total, current) => total + current.numberOfHours,
              0,
            ),
          0,
        ) / 7.5
    : 0;

  const futureHolidays = holidays
    ? holidays
        .filter(
          (h) =>
            h.status === "AUTHORISED" || h.status === "PENDING_AUTHORISATION",
        )
        .filter((h) => isAfter(h.timeEntries[0].date, new Date()))
        .reduce(
          (total, current) =>
            total +
            current.timeEntries.reduce(
              (total, current) => total + current.numberOfHours,
              0,
            ),
          0,
        ) / 7.5
    : 0;

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
      }}>
      <Box sx={{ padding: { xs: 0, sm: 2 } }}>
        <Card variant="soft" sx={{ padding: 0.5 }}>
          <Box
            sx={{
              display: { md: "flex", flexWrap: "wrap" },
              justifyContent: "flex-start",
            }}>
            {item("Holiday entitlement", holidayEntitlement + " days")}

            {item("Taken holidays", takenHolidays + " days")}

            {item("Future holidays", futureHolidays + " days")}

            {item(
              "Left to book",
              holidayEntitlement - takenHolidays - futureHolidays + " days",
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
