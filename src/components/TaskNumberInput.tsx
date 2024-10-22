import { FormControl, FormLabel, Autocomplete, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function TaskNumberInput({
  taskNumber,
  onChange,
  projectCode,
  error,
}: {
  taskNumber: string | null;
  onChange: (newValue: string | null) => any;
  projectCode: string | null;
  error?: string;
}) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (projectCode) {
      const getData = async () => {
        const { data, error } = await supabase
          .from("Task")
          .select("taskNumber")
          .eq("projectCode", projectCode);

        if (error) {
          console.error(error);
        } else {
          const taskNumbers = data.map((d: any) => d.taskNumber);
          setOptions(taskNumbers);
          if (!taskNumbers.includes(taskNumber)) {
            onChange(null);
          }
        }
      };

      getData();
    } else {
      onChange(null);
      setOptions([]);
    }
  }, [projectCode]);

  return (
    <FormControl required error={!!error} id="taskNumber" sx={{ mb: 2 }}>
      <FormLabel>Task ID</FormLabel>
      <Autocomplete
        value={taskNumber}
        onInput={(event: any) => {
          if (options.includes(event.target.value)) {
            onChange(event.target.value);
          }
        }}
        onChange={(_, newValue) => onChange(newValue)}
        options={options}
      />
      {error && (
        <Typography sx={{ mt: 1 }} fontSize="small" color="danger">
          {error}
        </Typography>
      )}
    </FormControl>
  );
}
