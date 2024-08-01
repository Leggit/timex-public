import { Button, Typography } from "@mui/joy";
import { useAuth } from "../hooks/auth";
import { ExitToApp } from "@mui/icons-material";

const SignOutButton = () => {
  const { signOut } = useAuth();
  return (
    <Button
      sx={{
        borderRadius: { xs: "0", sm: "sm" },
        fontSize: { xs: "lg", sm: "sm" },
        padding: { xs: 1.5, sm: 1 },
      }}
      size="sm"
      color="neutral"
      onClick={signOut}>
      <Typography
        fontSize="sm"
        sx={{ color: "white", display: { xs: "none", sm: "inherit" } }}>
        Sign out&nbsp;
      </Typography>
      <ExitToApp sx={{ mx: { xs: 2, sm: 0 } }} />
    </Button>
  );
};

export default SignOutButton;
