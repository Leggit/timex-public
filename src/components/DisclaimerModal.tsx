import { Modal, Sheet, Typography, Box, Button } from "@mui/joy";

export default function DisclaimerModal({
  open,
  close,
}: {
  open: boolean;
  close: () => any;
}) {
  return (
    <Modal
      open={open}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Sheet
        sx={{
          pt: { xs: 6, sm: 3 },
          borderRadius: "sm",
          width: 450,
          p: 3,
          boxShadow: "lg",
        }}>
        <Typography sx={{ mb: 1 }}>
          This application stores metadata relating to how it is accessed for
          debugging purposes.
        </Typography>
        <Typography sx={{ mb: 1 }}>
          The only "online identifier" included in this data is your IP address.
        </Typography>
        <Typography sx={{ mb: 1 }}>
          This data is permanently erased every 24 hours. By continuing you are
          consenting to this data being stored for the next 24 hours.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={() => close()}
            sx={{ display: "block", width: "100%", mb: 1 }}>
            Continue
          </Button>
          <Button
            onClick={() => window.open("about:blank", "_self")}
            variant="outlined"
            sx={{ width: "100%", mb: 1 }}
            color="neutral">
            Exit
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
}
