import { FormControl, FormLabel, Autocomplete, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import { useProjects } from "../hooks/projects";
import { IProject } from "../types/project.interface";

export default function ProjectCodeInput({
  label,
  projectCode,
  projectCodeChange,
  onBlur,
  error,
}: {
  label?: string;
  projectCode: string | null;
  onBlur?: () => void;
  projectCodeChange: (
    value: string | null,
    project: IProject | undefined,
  ) => void;
  error?: string;
}) {
  const { projects } = useProjects();
  const [internalError, setInternalError] = useState<string | null>(null);
  const [projectCodeValue, setProjectCodeValue] = useState<string | null>(
    projectCode,
  );

  const handleInput = (code: string | null) => {
    setProjectCodeValue(code);
    const project = projects.find((p) => p.projectCode === code);
    projectCodeChange(code, project);
    if (project) {
      setInternalError(null);
    }
  };

  useEffect(() => {
    if (error) {
      setInternalError(error);
    }
  }, [error]);

  return (
    <div
      onBlur={() => {
        onBlur?.();
        if (!projects.find((p) => p.projectCode === projectCodeValue)) {
          setInternalError("Not a valid project code");
        }
      }}>
      <FormControl
        error={!!internalError}
        id="projectCode"
        required
        sx={{ mb: 2 }}>
        <FormLabel>{label || "Project code"}</FormLabel>
        <Autocomplete
          autoComplete={false}
          freeSolo
          value={projectCode}
          onInput={(event: any) => handleInput(event.target.value)}
          onChange={(_, newValue) => handleInput(newValue)}
          noOptionsText={projectCode}
          clearOnBlur={false}
          openOnFocus={false}
          options={projects
            .filter((p) => p.recentlyUsed)
            .map((p) => p.projectCode)}
        />
        {internalError && (
          <Typography sx={{ mt: 1 }} fontSize="small" color="danger">
            {internalError}
          </Typography>
        )}
      </FormControl>
    </div>
  );
}
