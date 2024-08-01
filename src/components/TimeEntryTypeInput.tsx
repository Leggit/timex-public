import { FormControl, FormLabel, Autocomplete, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function TimeEntryTypeInput({
  typeOfTime,
  onChange,
  error,
}: {
  typeOfTime: string | null;
  onChange: (newValue: string | null) => any;
  error?: string;
}) {
  const [timeEntryTypes, setTimeEntryTypes] = useState<
    { label: string; id: string }[]
  >([]);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from("TimeEntryType").select("*");

      if (error) {
        console.error(error);
      } else {
        setTimeEntryTypes(
          data.map((item: any) => ({
            id: item.timeEntryTypeCode,
            label: item.description,
          })),
        );
      }
    };

    getData();
  }, []);

  return (
    <FormControl error={!!error} id="typeOfTime" required sx={{ mb: 2 }}>
      <FormLabel>Type of time</FormLabel>
      <Autocomplete
        value={timeEntryTypes.find((v) => v.id === typeOfTime) ?? null}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => onChange(newValue?.id ?? null)}
        options={timeEntryTypes}
      />
      {error && (
        <Typography sx={{ mt: 1 }} fontSize="small" color="danger">
          {error}
        </Typography>
      )}
    </FormControl>
  );
}
