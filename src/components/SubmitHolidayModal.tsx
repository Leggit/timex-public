import {
  Box,
  Button,
  Modal,
  Select,
  Sheet,
  Typography,
  Option,
  FormControl,
  FormLabel,
  ModalClose,
} from "@mui/joy";
import ProjectCodeInput from "./ProjectCodeInput";
import { IHoliday } from "../types/holiday.interface";
import { useState } from "react";
import { IProject } from "../types/project.interface";
import { supabase } from "../utils/supabase";
import { useHolidays } from "../hooks/holidays";
import { useResourceManagers } from "../hooks/resource-managers";
import { IResourceManager } from "../types/resource-manager.interface";
import HolidayDetailSummary from "./HolidayDetailSummary";

export default function SubmitHolidayModal({
  open,
  close,
  holiday,
}: {
  open: boolean;
  close: (success?: boolean) => any;
  holiday: IHoliday;
}) {
  const [selectedProject, setSelectedProject] = useState<IProject>();
  const [error, setError] = useState<string | null>(null);
  const [authoriserId, setAuthoriserId] = useState<number | null>(null);
  const { invalidateCache } = useHolidays();
  const allResourceManagers = useResourceManagers();
  const [filteredResourceManagers, setFilteredResourceManagers] = useState<
    IResourceManager[]
  >([]);

  const submitHoliday = async () => {
    const { error } = await supabase
      .from("Holiday")
      .update({
        status: "PENDING_AUTHORISATION",
        authoriser: authoriserId,
        authorisingProjectCode: selectedProject?.projectCode,
      })
      .eq("id", holiday.id);

    if (error) {
      console.log(error);
      setError("Failed to submit holiday");
    } else {
      invalidateCache();
      close(true);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => close()}
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
        <ModalClose variant="plain" sx={{ m: 1, mt: { xs: 5, sm: 1 } }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}>
          Submit holiday for approval
        </Typography>

        {error && (
          <Typography sx={{ my: 1 }} color="danger" fontSize="sm">
            {error}
          </Typography>
        )}

        <HolidayDetailSummary holiday={holiday} />

        <Box sx={{ mt: 2, mb: 4 }}>
          <ProjectCodeInput
            label="Authorising project code"
            projectCode={null}
            projectCodeChange={(code, project) => {
              setSelectedProject(project);
              setFilteredResourceManagers(
                allResourceManagers.filter((rm) => rm.projectCode === code),
              );
              setAuthoriserId(null);
            }}
          />
          <FormControl
            required
            sx={{ display: "flex" }}
            disabled={filteredResourceManagers.length === 0}>
            <FormLabel>Authoriser</FormLabel>
            <Select
              value={authoriserId}
              onChange={(_, value) => setAuthoriserId(value)}
              placeholder="select someone to authorise your holiday">
              {filteredResourceManagers.map((manager, index) => (
                <Option key={index} value={manager.id}>
                  {manager.firstName + " " + manager.lastName}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          onClick={() => submitHoliday()}
          sx={{ display: "block", width: "100%" }}
          disabled={!selectedProject || !authoriserId}>
          Submit
        </Button>
      </Sheet>
    </Modal>
  );
}
