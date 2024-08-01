import { Box, Button, Card, Chip, Typography } from "@mui/joy";
import { IHoliday } from "../types/holiday.interface";
import { format } from "date-fns";
import holidayStatusCodeToText from "../utils/holiday-status-code-to-text.function";
import holidayStatusCodeToActionText from "../utils/holiday-status-code-to-action-text.function";

export default function HolidayCard({
  holiday,
  onActionButtonClick,
}: {
  holiday: IHoliday;
  onActionButtonClick: (holiday: IHoliday) => any;
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
    <Card
      variant={
        ["CANCELLED", "TAKEN"].includes(holiday.status) ? "soft" : "outlined"
      }
      sx={{ mt: 1 }}>
      <Typography fontWeight="lg">
        {format(holiday.timeEntries[0].date, "dd/MM/yyyy")} -{" "}
        {format(holiday.timeEntries.at(-1)!.date, "dd/MM/yyyy")}&nbsp;(
        {days}
        {" day" + (days === 1 ? "" : "s")})
      </Typography>

      <Chip
        variant={
          ["CANCELLED", "TAKEN"].includes(holiday.status) ? "outlined" : "soft"
        }>
        {holidayStatusCodeToText(holiday.status)}{" "}
        {holiday.cancellationReason && (
          <span>-&nbsp;{holiday.cancellationReason}</span>
        )}
      </Chip>

      {holiday.status === "PENDING_AUTHORISATION" && (
        <Box>
          <Box>Authorising project code / authoriser:</Box>
          <Box>
            {holiday.authorisingProjectCode} -&nbsp;
            {holiday.authoriserFirstName + " " + holiday.authoriserLastName}
          </Box>
        </Box>
      )}

      {!["CANCELLED", "TAKEN"].includes(holiday.status) && (
        <Button
          onClick={() => onActionButtonClick(holiday)}
          sx={{ display: "flex", width: "100%" }}
          size="sm"
          color={
            ["PENDING_AUTHORISATION", "AUTHORISED"].includes(holiday.status)
              ? "warning"
              : "primary"
          }>
          {holidayStatusCodeToActionText(holiday.status)}
        </Button>
      )}
    </Card>
  );
}
