import {
  Box,
  Select,
  Option,
  FormControl,
  FormLabel,
  Card,
  Table,
  Snackbar,
  Button,
} from "@mui/joy";
import HolidaySummary from "../components/HolidaysSummary";
import Layout from "../components/Layout";
import SubmitHolidayModal from "../components/SubmitHolidayModal";
import HolidayRow from "../components/HolidayRow";
import { useHolidays } from "../hooks/holidays";
import { useEffect, useState } from "react";
import { IHoliday } from "../types/holiday.interface";
import ConfirmActionModal from "../components/ConfirmActionModal";
import { format, isBefore } from "date-fns";
import { CheckCircle, Warning } from "@mui/icons-material";
import { cancelHoliday } from "../utils/cancel-holiday.function";
import HolidayCard from "../components/HolidayCard";

export default function HolidaysPage() {
  const [showSubmitHolidayModal, setShowSubmitHolidayModal] = useState(false);
  const [showConfirmActionModal, setShowConfirmActionModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<IHoliday | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>("");
  const [snackbar, setSnackbar] = useState<{
    message: string;
    color: string;
    icon: any;
  } | null>(null);
  const currentYear = new Date().getFullYear();
  const { holidays, setSelectedYear, selectedYear, invalidateCache } =
    useHolidays();
  const [filteredHolidays, setFilteredHolidays] = useState<IHoliday[]>([]);
  const [sortDirection, setSortDirection] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(
    () =>
      setFilteredHolidays(
        holidays?.filter((h) => !statusFilter || h.status === statusFilter) ??
          [],
      ),
    [statusFilter, holidays],
  );

  const sortHolidays = (a: IHoliday, b: IHoliday) => {
    if (isBefore(a.timeEntries[0].date, b.timeEntries[0].date)) {
      return -1 * sortDirection;
    }
    if (isBefore(b.timeEntries[0].date, a.timeEntries[0].date)) {
      return 1 * sortDirection;
    }
    return 0;
  };

  return (
    <>
      <Layout
        mainContent={
          <>
            <Card
              sx={{
                borderWidth: { xs: 0, sm: 1 },
                padding: { xs: 0, sm: 2 },
                overflowY: "auto",
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
                mb: {
                  xs: 20,
                  sm: 10,
                },
              }}>
              <Box>
                <Card
                  variant="soft"
                  sx={{
                    backgroundColor: { xs: "neutral", sm: "background.body" },
                    padding: { xs: 1, sm: 0 },
                    borderWidth: { xs: 1, sm: 0 },
                  }}>
                  {showFilters && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                      }}>
                      <FormControl
                        sx={{ display: "flex", mr: { xs: 0, sm: 2 }, mb: 1 }}>
                        <FormLabel>Year</FormLabel>
                        <Select
                          value={selectedYear}
                          onChange={(e, value) => setSelectedYear(value!)}>
                          {new Array(100).fill(null).map((_, index) => (
                            <Option
                              key={index}
                              value={currentYear - 50 + index}>
                              {currentYear - 50 + index}
                            </Option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        sx={{ display: "flex", mr: { xs: 0, sm: 2 }, mb: 1 }}>
                        <FormLabel>Sort</FormLabel>
                        <Select
                          value={sortDirection}
                          onChange={(e, value) => setSortDirection(value ?? 1)}>
                          <Option value={1}>Soonest first</Option>
                          <Option value={-1}>Furthest away first</Option>
                        </Select>
                      </FormControl>
                      <FormControl
                        sx={{ display: "flex", mr: { xs: 0, sm: 2 }, mb: 1 }}>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={statusFilter}
                          onChange={(e, value) => setStatusFilter(value)}>
                          <Option value={""}>All</Option>
                          <Option value="NOT_SUBMITTED">Not submitted</Option>
                          <Option value="PENDING_AUTHORISATION">
                            Pending authorisation
                          </Option>
                          <Option value="TAKEN">Taken</Option>
                          <Option value="CANCELLED">Cancelled</Option>
                        </Select>
                      </FormControl>
                    </Box>
                  )}

                  <Box sx={{ display: { xs: "block", sm: "none" } }}>
                    <Button
                      variant="plain"
                      onClick={() => setShowFilters(!showFilters)}
                      sx={{ width: "100%" }}>
                      {showFilters ? "Hide " : "Show "} filter controls
                    </Button>
                  </Box>
                </Card>

                <Table
                  size="sm"
                  sx={{ display: { xs: "none", sm: "table" }, mt: 3 }}>
                  <thead>
                    <tr>
                      <th>Date range</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Authorising project</th>
                      <th>Authorising manager</th>
                      <th>Comment</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHolidays?.length ? (
                      filteredHolidays
                        .sort(sortHolidays)
                        .map((holiday, index) => (
                          <HolidayRow
                            key={index}
                            holiday={holiday}
                            onActionButtonClick={(holiday) => {
                              setSelectedHoliday(holiday);
                              if (holiday.status === "NOT_SUBMITTED") {
                                setShowSubmitHolidayModal(true);
                              } else {
                                setShowConfirmActionModal(true);
                              }
                            }}
                          />
                        ))
                    ) : (
                      <tr>
                        <td colSpan={7}>
                          <b>
                            <em>
                              {holidays === null
                                ? "loading..."
                                : "No results for the selected year"}
                            </em>
                          </b>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <Box sx={{ display: { xs: "block", sm: "none" } }}>
                  {filteredHolidays.sort(sortHolidays).map((holiday, index) => (
                    <HolidayCard
                      key={index}
                      holiday={holiday}
                      onActionButtonClick={(holiday) => {
                        setSelectedHoliday(holiday);
                        if (holiday.status === "NOT_SUBMITTED") {
                          setShowSubmitHolidayModal(true);
                        } else {
                          setShowConfirmActionModal(true);
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Card>
            <HolidaySummary />
          </>
        }
      />

      {showSubmitHolidayModal && selectedHoliday && (
        <SubmitHolidayModal
          open={showSubmitHolidayModal}
          holiday={selectedHoliday}
          close={(success) => {
            if (success !== undefined) {
              setSnackbar({
                message: success
                  ? "Holiday submitted for authorisation successfully"
                  : "Failed to submit holiday",
                color: success ? "success" : "danger",
                icon: success ? <CheckCircle /> : <Warning />,
              });
            }
            setShowSubmitHolidayModal(false);
            setSelectedHoliday(null);
          }}
        />
      )}

      {showConfirmActionModal && selectedHoliday && (
        <ConfirmActionModal
          message={
            "Are you sure you want to cancel your holiday from " +
            format(selectedHoliday.timeEntries[0].date, "dd/MM/yyyy") +
            " to " +
            format(selectedHoliday.timeEntries.at(-1)!.date, "dd/MM/yyyy") +
            "?"
          }
          open={showConfirmActionModal}
          close={async (actionConfirmed) => {
            if (actionConfirmed) {
              const message = await cancelHoliday(
                selectedHoliday.id,
                invalidateCache,
              );
              setSnackbar(message);
            }
            setShowConfirmActionModal(false);
            setSelectedHoliday(null);
          }}
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
