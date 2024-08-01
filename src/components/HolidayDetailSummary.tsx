import { Box, Typography } from "@mui/joy";
import { format } from "date-fns";
import { IHoliday } from "../types/holiday.interface";
import { CalendarMonth } from "@mui/icons-material";

export default function HolidayDetailSummary({
  holiday,
  showAuthorisingDetails,
}: {
  holiday: IHoliday;
  showAuthorisingDetails?: boolean;
}) {
  const hoursPerDay = 7.5;
  const days =
    Math.round(
      (holiday.timeEntries.reduce(
        (total, current) => total + current.numberOfHours,
        0,
      ) /
        hoursPerDay) *
        10,
    ) / 10;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CalendarMonth />
        &nbsp;
        <Typography>
          {format(holiday.timeEntries[0].date, "dd/MM/yyyy")} -{" "}
          {format(holiday.timeEntries.at(-1)!.date, "dd/MM/yyyy")}
        </Typography>
        &nbsp; &nbsp;
        <Typography fontWeight="bold">
          ({days} {" day" + (days === 1 ? "" : "s")})
        </Typography>
      </Box>
      {showAuthorisingDetails && (
        <Box>
          <Typography>
            Authorising project:{" "}
            <Typography fontWeight="lg">
              {holiday.authorisingProjectCode}
            </Typography>
          </Typography>
          <Typography>
            Authoriser:{" "}
            <Typography fontWeight="lg">
              {holiday.authoriserFirstName + " " + holiday.authoriserLastName}
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
}
