import { Box, Modal, ModalClose, Typography, Button } from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import { ITimeEntry, deserialize } from "../types/time-entry.interface";
import { useAuth } from "../hooks/auth";
import DayPicker from "./DayPicker";
import { format } from "date-fns";
import ProjectCodeInput from "./ProjectCodeInput";
import TimeEntryTypeInput from "./TimeEntryTypeInput";
import TaskNumberInput from "./TaskNumberInput";
import ProbabilityInput from "./ProbabilityInput";

const TimeEntryModal = ({
  selectedDate,
  open,
  close,
  timeEntriesForMonth,
}: {
  selectedDate: Date;
  open: boolean;
  close: (newTimeEntries: ITimeEntry[]) => void;
  timeEntriesForMonth: ITimeEntry[];
}) => {
  const { user } = useAuth();
  const [typeOfTime, setTypeOfTime] = useState<string | null>(null);
  const [projectCode, setProjectCode] = useState<string | null>("");
  const [validProjectCode, setValidProjectCode] = useState<string | null>(null);
  const [taskNumber, setTaskNumber] = useState<string | null>("");
  const [probability, setProbablity] = useState<string | null>("");
  const [selectedDays, setSelectedDays] = useState<{ [key: number]: number }>(
    {},
  );
  const [error, setError] = useState<any>(null);
  const [validationMessages, setValidationMessages] = useState(
    new Map<string, string>(),
  );
  const [saving, setSaving] = useState(false);

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
    if (
      Object.keys(selectedDays).length <= 0 ||
      Object.values(selectedDays).every((value) => value <= 0)
    ) {
      newValidationMessages.set(
        "selectedDays",
        "You must enter some time against at least one day",
      );
    }

    if (newValidationMessages.size === 0) {
      const timeEntrys: ITimeEntry[] = Object.keys(selectedDays)
        .map(
          (key) =>
            [new Date(parseFloat(key)), selectedDays[key as any]] as [
              Date,
              number,
            ],
        )
        .map(([date, hours]) => ({
          date,
          userId: user!.id,
          timeEntryTypeCode: typeOfTime!,
          projectCode: projectCode!,
          taskNumber: taskNumber!,
          numberOfHours: hours,
          probability: probability ? parseFloat(probability) : undefined,
        }));

      const { data, error } = await supabase
        .from("TimeEntry")
        .upsert(
          timeEntrys.map((entry) => ({
            ...entry,
            date: `${entry.date.getFullYear()}-${
              entry.date.getMonth() + 1
            }-${entry.date.getDate()}`,
          })),
        )
        .select();

      if (error) {
        setError(error);
        setSaving(false);
      } else {
        close(deserialize(...data));
      }
    } else {
      setValidationMessages(newValidationMessages);
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => close([])}
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
        <ModalClose variant="plain" sx={{ m: 1, mt: { xs: 5, sm: 1 } }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}>
          Enter Time for {format(selectedDate, "LLLL")}
        </Typography>

        {error && (
          <Typography color="danger" mb={1}>
            Failed to save data
          </Typography>
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

          {typeOfTime === "FORECAST" && (
            <ProbabilityInput
              error={validationMessages.get("probability")}
              probability={probability}
              onChange={setProbablity}
            />
          )}

          <DayPicker
            error={validationMessages.get("selectedDays")}
            currentTimeEntries={timeEntriesForMonth}
            selectionChanged={(days) => setSelectedDays(days)}
            selectedDate={selectedDate}
          />
          {validationMessages.get("selectedDays") && (
            <Typography sx={{ mt: 1 }} fontSize="sm" color="danger">
              {validationMessages.get("selectedDays")}
            </Typography>
          )}
        </Box>

        <Button
          loading={saving}
          sx={{ width: "100%", mt: 2 }}
          onClick={() => {
            setSaving(true);
            save();
          }}>
          Save
        </Button>
      </Sheet>
    </Modal>
  );
};

export default TimeEntryModal;
