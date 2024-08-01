import { Box, Checkbox, Tooltip } from "@mui/joy";
import { ITimeEntry } from "../types/time-entry.interface";
import { Circle } from "@mui/icons-material";
import holidayStatusCodeToColour from "../utils/holiday-status-code-to-colour.function";
import holidayStatusCodeToText from "../utils/holiday-status-code-to-text.function";

export default function TimeEntry({
  timeEntry,
  disabled,
  onClick,
  selectionMode,
  selected,
}: {
  timeEntry: ITimeEntry;
  disabled?: boolean;
  onClick: (...args: any) => any;
  selectionMode?: boolean;
  selected: boolean;
}) {
  const getColour = () => {
    if (timeEntry.isHoliday && timeEntry.holidayStatus === "CANCELLED") {
      return "rgb(97, 97, 97)";
    }
    if (timeEntry.displayColour) {
      return timeEntry.displayColour;
    }
    return "rgb(97, 97, 97)";
  };

  return (
    <Tooltip
      title={
        timeEntry.holidayStatus
          ? holidayStatusCodeToText(timeEntry.holidayStatus)
          : null
      }
      arrow>
      <Box
        onClick={onClick}
        fontSize="sm"
        sx={{
          cursor:
            disabled || timeEntry.holidayStatus === "CANCELLED"
              ? "auto"
              : "pointer",
          color: "#fff",
          opacity:
            disabled || timeEntry.holidayStatus === "CANCELLED" ? "0.65" : "1",
          paddingX: 1,
          backgroundColor: getColour(),
          borderRadius: "sm",
        }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex" }}>
            {selectionMode && !timeEntry.isHoliday && !disabled && (
              <Checkbox sx={{ mr: 1 }} checked={selected} />
            )}
            {timeEntry.isHoliday && (
              <Box
                sx={{
                  display: "inline-flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mr: 1,
                }}>
                <Circle
                  sx={{ border: "1px solid white", borderRadius: "100%" }}
                  color={holidayStatusCodeToColour(timeEntry.holidayStatus!)}
                  fontSize="small"
                />
              </Box>
            )}
            {timeEntry.projectCode}
          </Box>
          <Box>{timeEntry.numberOfHours}</Box>
        </Box>
      </Box>
    </Tooltip>
  );
}
