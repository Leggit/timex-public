import { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/joy";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import Timesheet from "../components/Timesheet";
import MonthPickerModal from "../components/MonthPickerModal";
import {
  AddCircle,
  CheckBox,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Delete,
  Edit,
  EditCalendar,
  TimelapseOutlined,
  Warning,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { ITimeEntry, deserialize } from "../types/time-entry.interface";
import { deleteTimeEntries } from "../utils/delete-time-entries.function";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { useHolidays } from "../hooks/holidays";
import { supabase } from "../utils/supabase";
import { useAuth } from "../hooks/auth";
import { cancelHoliday } from "../utils/cancel-holiday.function";
import CannotEditHolidayModal from "../components/CannotEditHolidayModal";
import TimeEntryEditModal from "../components/TimeEntryEditModal";
import TimeEntryModal from "../components/TimeEntryModal";
import { useMonthCalendar } from "../hooks/calendar";

function TimeSheetPage() {
  const [today] = useState(new Date());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [showMonthPickerModal, setShowMonthPickerModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(year, month - 1, 1));
  const [showIncompleteDays, setShowIncompleteDays] = useState(false);
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTimeEntries, setSelectionTimeEntries] = useState<ITimeEntry[]>(
    [],
  );
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<ITimeEntry | null>(
    null,
  );
  const [snackbar, setSnackbar] = useState<{
    message: string;
    color: string;
    icon: any;
  } | null>(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const { invalidateCache } = useHolidays();
  const { user } = useAuth();
  const [allTimeEntriesForPage, setAllTimeEntriesForPage] = useState<
    ITimeEntry[]
  >([]);
  const [loading, setLoading] = useState(false);

  const monthCalendar = useMonthCalendar(year, month);

  useEffect(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_time_entries_for_user", {
        user_id: user?.id,
        min_date: format(monthCalendar[0].date, "yyyy-MM-dd"),
        max_date: format(monthCalendar.at(-1)!.date, "yyyy-MM-dd"),
      });

      if (error) {
        console.error(error);
      } else {
        setAllTimeEntriesForPage(deserialize(...data!));
      }
      setLoading(false);
    };

    if (monthCalendar[0] && monthCalendar.at(-1)) {
      getData();
    }
  }, [monthCalendar, user?.id, updateCounter]);

  const goBack = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const goForward = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const setToToday = () => {
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };

  const toggleTimeEntrySelected = (timeEntry: ITimeEntry) => {
    const index = selectedTimeEntries.indexOf(timeEntry);
    if (index >= 0) {
      selectedTimeEntries.splice(index, 1);
      setSelectionTimeEntries([...selectedTimeEntries]);
    } else {
      setSelectionTimeEntries([...selectedTimeEntries, timeEntry]);
    }
  };

  const deleteSelectedTimeEntries = async () => {
    const { error, success } = await deleteTimeEntries(
      ...selectedTimeEntries.map((item) => item.id),
    );

    if (success) {
      setSnackbar({
        message: "Deleted " + selectedTimeEntries.length + " items",
        color: "success",
        icon: <CheckCircle />,
      });
      setSelectionMode(false);
      setUpdateCounter(updateCounter + 1);
    } else {
      console.error(error);
      setSnackbar({
        message: "Failed to delete",
        color: "danger",
        icon: <Warning />,
      });
    }
  };

  useEffect(() => setSelectionTimeEntries([]), [selectionMode]);

  return (
    <>
      <Layout
        topContent={
          <>
            {!selectionMode && (
              <>
                <ButtonGroup>
                  <IconButton
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    onClick={goBack}>
                    <ChevronLeft fontSize="small" />
                  </IconButton>
                  <Button
                    size="sm"
                    onClick={() => setShowMonthPickerModal(true)}
                    color="neutral"
                    variant="outlined"
                    sx={{ minWidth: { xs: "auto", sm: "160px" } }}
                    endDecorator={<EditCalendar fontSize="small" />}>
                    {format(currentDate, "MMMM yyyy", { locale: enGB })}
                  </Button>
                  <IconButton
                    size="sm"
                    color="neutral"
                    variant="outlined"
                    onClick={goForward}>
                    <ChevronRight fontSize="small" />
                  </IconButton>
                </ButtonGroup>
                <Button
                  size="sm"
                  onClick={() => setToToday()}
                  sx={{ ml: 1, display: { xs: "none", sm: "block" } }}
                  variant="outlined"
                  color="neutral">
                  Today
                </Button>

                <Tooltip title="Toggle indicator for days which need more time entries">
                  <IconButton
                    size="sm"
                    sx={{ ml: 1, display: { xs: "none", sm: "flex" } }}
                    onClick={() => setShowIncompleteDays(!showIncompleteDays)}
                    color="primary"
                    variant={showIncompleteDays ? "solid" : "outlined"}>
                    <TimelapseOutlined />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Button
              sx={{ ml: selectionMode ? 0 : 1 }}
              variant={selectionMode ? "solid" : "outlined"}
              onClick={() => setSelectionMode(!selectionMode)}>
              Select&nbsp;
              <CheckBox />
            </Button>
            {selectionMode && (
              <Box
                sx={{
                  ml: 2,
                  backgroundColor: "neutral.softBg",
                  borderRadius: "sm",
                  display: "flex",
                }}>
                <Box sx={{ display: "flex" }}>
                  <Box
                    sx={{
                      ml: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}>
                    <Typography fontSize="sm" fontWeight="lg">
                      {selectedTimeEntries.length} selected &nbsp;
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => setShowConfirmDeleteModal(true)}
                    disabled={selectedTimeEntries.length === 0}
                    size="sm"
                    variant="plain"
                    color="danger">
                    <Typography
                      color={selectedTimeEntries.length ? "danger" : "neutral"}
                      sx={{ display: { xs: "none", sm: "inherit" } }}
                      fontSize="sm">
                      Delete &nbsp;
                    </Typography>
                    <Delete />
                  </Button>
                  <Button
                    onClick={() =>
                      setSnackbar({
                        message: "This action has not yet been implemented",
                        color: "warning",
                        icon: <Warning />,
                      })
                    }
                    disabled={selectedTimeEntries.length === 0}
                    size="sm"
                    variant="plain">
                    <Typography
                      color={selectedTimeEntries.length ? "primary" : "neutral"}
                      sx={{ display: { xs: "none", sm: "inherit" } }}
                      fontSize="sm">
                      Modify &nbsp;
                    </Typography>
                    <Edit />
                  </Button>
                </Box>
              </Box>
            )}

            {!selectionMode && (
              <Button
                onClick={() => setShowTimeEntryModal(true)}
                sx={{ ml: 1, flexGrow: 1 }}>
                <Typography
                  sx={{
                    color: "white",
                    display: { xs: "none", sm: "inherit" },
                  }}
                  fontSize="sm">
                  Add time &nbsp;
                </Typography>
                <AddCircle />
              </Button>
            )}
          </>
        }
        mainContent={
          <Timesheet
            loading={loading}
            updateCounter={updateCounter}
            selectedTimeEntries={selectedTimeEntries}
            toggleTimeEntrySelected={(timeEntry) => {
              if (selectionMode) {
                toggleTimeEntrySelected(timeEntry);
              } else {
                setSelectedTimeEntry(timeEntry);
              }
            }}
            selectionMode={selectionMode}
            showIncompleteDays={showIncompleteDays}
            showTimeEntryModal={showTimeEntryModal}
            closeTimeEntryModal={() => setShowTimeEntryModal(false)}
            month={monthCalendar}
            allTimeEntriesForPage={allTimeEntriesForPage}
          />
        }
      />

      {showMonthPickerModal && (
        <MonthPickerModal
          currentMonth={month - 1}
          currentYear={year}
          open={showMonthPickerModal}
          close={({ selectedYear, selectedMonth }) => {
            setShowMonthPickerModal(false);
            setMonth(selectedMonth + 1);
            setYear(selectedYear);
          }}
        />
      )}

      {showConfirmDeleteModal && (
        <ConfirmActionModal
          message={
            "Are you sure you want to delete " +
            selectedTimeEntries.length +
            " time entries?"
          }
          open={showConfirmDeleteModal}
          close={(answer) => {
            if (answer) {
              deleteSelectedTimeEntries();
            }
            setShowConfirmDeleteModal(false);
          }}
        />
      )}

      {showTimeEntryModal && currentDate && (
        <TimeEntryModal
          timeEntriesForMonth={allTimeEntriesForPage}
          selectedDate={currentDate}
          close={(newTimeEntries) => {
            setShowTimeEntryModal(false);
            if (newTimeEntries.length) {
              setSnackbar({
                message: "Your input was saved successfully",
                color: "success",
                icon: <CheckCircle />,
              });
              setUpdateCounter((prev) => prev + 1);
              invalidateCache();
            }
          }}
          open={showTimeEntryModal}
        />
      )}

      {selectedTimeEntry &&
        !["PENDING_AUTHORISATION", "AUTHORISED", "CANCELLED"].includes(
          selectedTimeEntry.holidayStatus!,
        ) && (
          <TimeEntryEditModal
            timeEntry={selectedTimeEntry}
            close={({ updatedTimeEntry, deleted, submittedHoliday }) => {
              if (updatedTimeEntry) {
                setSnackbar({
                  message: "Your input was saved successfully",
                  color: "success",
                  icon: <CheckCircle />,
                });
                setUpdateCounter((prev) => prev + 1);
                invalidateCache();
              }
              if (deleted) {
                setSnackbar({
                  message: "Time entry deleted",
                  color: "success",
                  icon: <CheckCircle />,
                });
                setUpdateCounter((prev) => prev + 1);
                invalidateCache();
              }
              if (submittedHoliday) {
                setSnackbar({
                  message: "Holiday submitted",
                  color: "success",
                  icon: <CheckCircle />,
                });
                setUpdateCounter((prev) => prev + 1);
                invalidateCache();
              }
              setSelectedTimeEntry(null);
            }}
            open={
              !!selectedTimeEntry &&
              !["PENDING_AUTHORISATION", "AUTHORISED"].includes(
                selectedTimeEntry.holidayStatus!,
              )
            }
          />
        )}

      {selectedTimeEntry &&
        ["PENDING_AUTHORISATION", "AUTHORISED"].includes(
          selectedTimeEntry.holidayStatus!,
        ) && (
          <CannotEditHolidayModal
            timeEntry={selectedTimeEntry}
            close={async (cancel: boolean) => {
              setSelectedTimeEntry(null);
              if (cancel) {
                const resultMessage = await cancelHoliday(
                  selectedTimeEntry.holidayId,
                  () => {
                    invalidateCache();
                    setUpdateCounter((prev) => prev + 1);
                  },
                );
                setSnackbar(resultMessage);
              }
            }}
            open={
              !!selectedTimeEntry &&
              ["PENDING_AUTHORISATION", "AUTHORISED"].includes(
                selectedTimeEntry.holidayStatus!,
              )
            }
          />
        )}

      {snackbar && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          color={snackbar.color as any}
          variant="solid"
          autoHideDuration={2000}
          open={!!snackbar}
          onClose={() => {
            setSnackbar(null);
          }}>
          {snackbar.icon}
          {snackbar.message}
        </Snackbar>
      )}
    </>
  );
}

export default TimeSheetPage;
