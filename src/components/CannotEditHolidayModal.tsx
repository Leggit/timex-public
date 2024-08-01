import {
  Modal,
  Sheet,
  Typography,
  Box,
  Button,
  Card,
  ModalClose,
} from "@mui/joy";
import { ITimeEntry } from "../types/time-entry.interface";
import HolidayDetailSummary from "./HolidayDetailSummary";
import { useHolidays } from "../hooks/holidays";
import holidayStatusCodeToText from "../utils/holiday-status-code-to-text.function";

export default function CannotEditHolidayModal({
  timeEntry,
  open,
  close,
}: {
  timeEntry: ITimeEntry;
  open: boolean;
  close: (cancel: boolean) => any;
}) {
  const { holidays } = useHolidays();
  const holiday = holidays?.find((h) => h.id === timeEntry.holidayId);

  return (
    <Modal
      open={open}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Sheet
        variant="outlined"
        sx={{
          pt: { xs: 6, sm: 3 },
          width: { xs: "100%", sm: 500 },
          minHeight: { xs: "100vh", sm: "auto" },
          borderRadius: { xs: 0, sm: "md" },
          p: 3,
          boxShadow: "lg",
        }}>
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="md"
          mb={1}>
          You cannot edit this time entry as it is part of a holiday that in in
          a status of
          {" " + holidayStatusCodeToText(holiday?.status!)}:
        </Typography>

        <Card>
          {holiday && (
            <HolidayDetailSummary showAuthorisingDetails holiday={holiday} />
          )}
        </Card>

        <Box sx={{ display: "flex", mt: 2 }}>
          <Button onClick={() => close(false)} sx={{ width: "50%" }}>
            Back
          </Button>
          &nbsp;
          <Button
            onClick={() => close(true)}
            sx={{ width: "50%" }}
            color="warning">
            Cancel Holiday
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
}
