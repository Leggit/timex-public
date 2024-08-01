import { Box } from "@mui/joy";
import NavBar from "./Navbar";

export default function Layout({
  topContent,
  mainContent,
}: {
  topContent?: any;
  mainContent?: any;
}) {
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          px: {
            xs: 1,
            md: 2,
          },
        }}>
        <Box
          sx={{
            pt: { xs: 0, sm: 2 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: { xs: "auto", sm: "hidden" },
            overflowX: "hidden",
          }}>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: ["column-reverse", "column-reverse", "row"],
              mt: { xs: 7, sm: 0 },
            }}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              {topContent}
            </Box>
            <Box sx={{ mb: [1, 1, 0] }}>
              <NavBar />
            </Box>
          </Box>
          <Box></Box>
          {mainContent}
        </Box>
      </Box>
    </>
  );
}
