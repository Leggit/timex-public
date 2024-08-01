import { Button } from "@mui/joy";
import { IHoliday } from "../types/holiday.interface";
import { format } from "date-fns";
import holidayStatusCodeToText from "../utils/holiday-status-code-to-text.function";
import holidayStatusCodeToActionText from "../utils/holiday-status-code-to-action-text.function";

export default function HolidayRow({
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
    <tr>
      <td>
        {format(holiday.timeEntries[0].date, "dd/MM/yyyy")} -{" "}
        {format(holiday.timeEntries.at(-1)!.date, "dd/MM/yyyy")}
      </td>
      <td>
        {days}
        {" day" + (days === 1 ? "" : "s")}
      </td>
      <td>{holidayStatusCodeToText(holiday.status)}</td>
      <td>{holiday.authorisingProjectCode ?? "-"}</td>
      <td>
        {holiday.authoriserId !== null
          ? holiday.authoriserFirstName + " " + holiday.authoriserLastName
          : "-"}
      </td>
      <td>{holiday.cancellationReason}</td>
      <td>
        <Button
          onClick={() => onActionButtonClick(holiday)}
          sx={{ display: "flex", width: "100%" }}
          disabled={["CANCELLED", "TAKEN"].includes(holiday.status)}
          size="sm"
          color={
            ["PENDING_AUTHORISATION", "AUTHORISED"].includes(holiday.status)
              ? "warning"
              : "primary"
          }>
          {holidayStatusCodeToActionText(holiday.status)}
        </Button>
      </td>
    </tr>
  );
}
