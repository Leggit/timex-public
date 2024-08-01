import { Badge, Box, Button, Tooltip } from "@mui/joy";
import SignOutButton from "../components/SignOutButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useHolidays } from "../hooks/holidays";

export default function NavBar() {
  const nav = useNavigate();
  const location = useLocation();
  const { notSubmittedHolidaysCount } = useHolidays();

  const getNotSubmittedHolidaysValue = (count: number) => {
    if (count === 0) {
      return null;
    }
    if (count > 9) {
      return "9+";
    }
    return count;
  };

  return (
    <Box
      sx={{
        position: { xs: "fixed", sm: "relative" },
        width: "100%",
        top: 0,
        left: 0,
        display: "flex",
        zIndex: 999,
      }}>
      <Button
        size="sm"
        onClick={() => nav("/timesheet")}
        variant={location.pathname === "/timesheet" ? "solid" : "outlined"}
        color={location.pathname === "/timesheet" ? "primary" : "neutral"}
        sx={{
          borderRadius: { xs: "0", sm: "sm" },
          mr: { xs: 0, sm: 1 },
          flexGrow: 1,
          fontSize: { xs: "lg", sm: "sm" },
          padding: { xs: 1.5, sm: 1 },
          backgroundColor:
            location.pathname === "/timesheet" ? "primary" : "white",
        }}>
        Timesheet
      </Button>

      <Tooltip
        arrow
        title={
          notSubmittedHolidaysCount > 0
            ? "You have " +
              notSubmittedHolidaysCount +
              " holiday request" +
              (notSubmittedHolidaysCount === 1 ? "" : "s") +
              " to submit"
            : null
        }>
        <Badge
          color="warning"
          variant="solid"
          size="sm"
          sx={{ mr: 1, display: { xs: "none", sm: "inherit" } }}
          badgeContent={getNotSubmittedHolidaysValue(
            notSubmittedHolidaysCount,
          )}>
          <Button
            size="sm"
            onClick={() => nav("/holidays")}
            variant={location.pathname === "/holidays" ? "solid" : "outlined"}
            color={location.pathname === "/holidays" ? "primary" : "neutral"}>
            Holidays
          </Button>
        </Badge>
      </Tooltip>

      <Button
        sx={{
          borderRadius: { xs: "0", sm: "sm" },
          display: { xs: "auto", sm: "none" },
          flexGrow: 1,
          fontSize: { xs: "lg", sm: "sm" },
          padding: { xs: 1.5, sm: 1 },
          backgroundColor:
            location.pathname === "/holidays" ? "primary" : "white",
        }}
        size="sm"
        onClick={() => nav("/holidays")}
        variant={location.pathname === "/holidays" ? "solid" : "outlined"}
        color={location.pathname === "/holidays" ? "primary" : "neutral"}>
        Holidays
      </Button>

      <SignOutButton />
    </Box>
  );
}
