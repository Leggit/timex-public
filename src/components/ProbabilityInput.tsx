import { FormControl, FormLabel, Select, Typography, Option } from "@mui/joy";

export default function ProbabilityInput({
  error,
  probability,
  onChange,
}: {
  probability: string | null;
  error?: string;
  onChange: (newValue: string | null) => any;
}) {
  return (
    <FormControl error={!!error} id="probability" required sx={{ mb: 2 }}>
      <FormLabel>Probability</FormLabel>
      <Select
        value={probability}
        onChange={(_, newValue) => onChange(newValue)}>
        <Option value="">Select a probability</Option>
        <Option value="100">100%</Option>
        <Option value="99">99%</Option>
        <Option value="90">90%</Option>
      </Select>
      {error && (
        <Typography sx={{ mt: 1 }} fontSize="small" color="danger">
          {error}
        </Typography>
      )}
    </FormControl>
  );
}
