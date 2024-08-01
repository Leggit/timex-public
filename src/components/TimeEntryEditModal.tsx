import {
  Box,
  FormControl,
  FormLabel,
  Modal,
  ModalClose,
  Typography,
  Input,
  Button,
  Card,
} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import { useState } from "react";
import { ITimeEntry } from "../types/time-entry.interface";
import { format } from "date-fns";
import ProjectCodeInput from "./ProjectCodeInput";
import TimeEntryTypeInput from "./TimeEntryTypeInput";
import { useHolidays } from "../hooks/holidays";
import SubmitHolidayModal from "./SubmitHolidayModal";
import HolidayDetailSummary from "./HolidayDetailSummary";
import { deleteTimeEntries } from "../utils/delete-time-entries.function";
import TaskNumberInput from "./TaskNumberInput";
import { supabase } from "../utils/supabase";
import ProbabilityInput from "./ProbabilityInput";

export default function TimeEntryEditModal({
  timeEntry,
  open,
  close,
}: {
  timeEntry: ITimeEntry;
  open: boolean;
  close: ({
    updatedTimeEntry,
    submittedHoliday,
    deleted,
  }: {
    updatedTimeEntry?: boolean;
    submittedHoliday?: boolean;
    deleted?: boolean;
  }) => void;
}) {
  const [typeOfTime, setTypeOfTime] = useState<string | null>(
    timeEntry.timeEntryTypeCode,
  );
  const [projectCode, setProjectCode] = useState<string | null>(
    timeEntry.projectCode,
  );
  const [validProjectCode, setValidProjectCode] = useState<string | null>(
    timeEntry.projectCode,
  );
  const [taskNumber, setTaskNumber] = useState<string | null>(
    timeEntry.taskNumber,
  );
  const [numberOfHours, setNumberOfHours] = useState<string | undefined>(
    String(timeEntry.numberOfHours),
  );
  const [probability, setProbablity] = useState<string | null>(
    timeEntry.probability ? String(timeEntry.probability) : null,
  );

  const [error, setError] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { holidays } = useHolidays();
  const holiday = holidays?.find((h) => h.id === timeEntry.holidayId);
  const [showSubmitHolidayModal, setShowSubmitHolidayModal] = useState(false);

  const [validationMessages, setValidationMessages] = useState(
    new Map<string, string>(),
  );

  const clearValidationMessages = () => setValidationMessages(new Map());

  const save = async () => {
    clearValidationMessages();

    const newValidationMessages = new Map<string, string>();

    if (!typeOfTime) {
      newValidationMessages.set("typeOfTime", "This is a required field");
    }
    if (!projectCode) {
      newValidationMessages.set("projectCode", "This is a required field");
    }
    if (!taskNumber) {
      newValidationMessages.set("taskNumber", "This is a required field");
    }
    if (!probability && typeOfTime === "FORECAST") {
      newValidationMessages.set(
        "probability",
        "You must provide a probability to forecast time",
      );
    }
    if (!numberOfHours) {
      newValidationMessages.set(
        "numberOfHours",
        "Number of hours must be a non zero value",
      );
    }

    if (newValidationMessages.size === 0) {
      const { data, error } = await supabase
        .from("TimeEntry")
        .update({
          projectCode,
          timeEntryTypeCode: typeOfTime,
          taskNumber,
          numberOfHours: parseFloat(numberOfHours!),
          probability,
        })
        .eq("id", timeEntry.id);

      if (error) {
        setError(error);
        setSaving(false);
      } else {
        close({ updatedTimeEntry: true });
      }
    } else {
      setSaving(false);
      setValidationMessages(newValidationMessages);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={() => close({})}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
        }}>
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
            fontWeight="lg"
            mb={1}>
            Edit time entry for {format(timeEntry.date, "EEE PPP")}
            <ModalClose variant="plain" sx={{ m: 1, mt: { xs: 5, sm: 1 } }} />
          </Typography>

          {error && (
            <Typography color="danger" mb={1}>
              Failed to save data
            </Typography>
          )}

          {holiday && (
            <Card variant="solid" color="warning" invertedColors sx={{ mb: 1 }}>
              <Typography>
                This time entry is part of an unsubmitted holiday:
              </Typography>
              <HolidayDetailSummary holiday={holiday} />
              <Button
                onClick={() => setShowSubmitHolidayModal(true)}
                size="sm"
                color="warning">
                Submit for authorisation
              </Button>
            </Card>
          )}

          <Box>
            <TimeEntryTypeInput
              error={validationMessages.get("typeOfTime")}
              typeOfTime={typeOfTime}
              onChange={(newValue) => setTypeOfTime(newValue)}
            />

            <ProjectCodeInput
              error={validationMessages.get("projectCode")}
              projectCode={projectCode}
              projectCodeChange={(value, project) => {
                setProjectCode(value);
                setValidProjectCode(project?.projectCode ?? null);
              }}
            />

            <TaskNumberInput
              error={validationMessages.get("taskNumber")}
              projectCode={validProjectCode}
              taskNumber={taskNumber}
              onChange={(newValue) => setTaskNumber(newValue)}
            />

            <FormControl
              error={validationMessages.has("numberOfHours")}
              id="hours"
              required
              sx={{ mb: 2 }}>
              <FormLabel>Number of hours</FormLabel>

              <Input
                value={numberOfHours}
                onChange={(event) => setNumberOfHours(event.target.value)}
                type="number"
              />

              {validationMessages.has("numberOfHours") && (
                <Typography sx={{ mt: 1 }} fontSize="sm" color="danger">
                  {validationMessages.get("numberOfHours")}
                </Typography>
              )}
            </FormControl>

            {typeOfTime === "FORECAST" && (
              <ProbabilityInput
                error={validationMessages.get("probability")}
                probability={probability}
                onChange={setProbablity}
              />
            )}
          </Box>

          <Button
            loading={saving}
            sx={{ width: "100%", mb: 1 }}
            onClick={() => {
              setSaving(true);
              save();
            }}>
            Save
          </Button>
          {!saving && (
            <Button
              loading={saving}
              sx={{ width: "100%" }}
              color="danger"
              onClick={async () => {
                setSaving(true);
                const { error } = await deleteTimeEntries(timeEntry.id);
                if (error) {
                  setError(error);
                  setSaving(false);
                } else {
                  close({ deleted: true });
                }
              }}>
              Delete
            </Button>
          )}
        </Sheet>
      </Modal>

      {holiday && showSubmitHolidayModal && (
        <SubmitHolidayModal
          holiday={holiday}
          close={(success) => {
            if (success) {
              close({ submittedHoliday: true });
            } else {
              setShowSubmitHolidayModal(false);
            }
          }}
          open={!!holiday && showSubmitHolidayModal}
        />
      )}
    </>
  );
}
