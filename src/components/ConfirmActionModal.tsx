import { Modal, Sheet, Typography, Box, Button } from "@mui/joy";

export default function ConfirmActionModal({
  message,
  subMessage,
  open,
  close,
}: {
  message: string;
  subMessage?: string;
  open: boolean;
  close: (result: boolean) => any;
}) {
  return (
    <Modal
      open={open}
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
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}>
          {message}
        </Typography>

        {subMessage && (
          <Box sx={{ display: "flex" }}>
            <Typography>{subMessage}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex" }}>
          <Button sx={{ flexGrow: 1 }} onClick={() => close(true)}>
            Yes
          </Button>
          &nbsp;&nbsp;
          <Button
            sx={{ flexGrow: 1 }}
            color="neutral"
            onClick={() => close(false)}>
            No
          </Button>
        </Box>
      </Sheet>
    </Modal>
  );
}
