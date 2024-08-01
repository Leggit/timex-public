import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { supabase } from "../utils/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Error } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import DisclaimerModal from "../components/DisclaimerModal";

export default function SignInPage() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const login = () => {
    supabase.auth
      .signInWithPassword({ email: userId!, password })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          navigate("/timesheet");
        }
      });
  };

  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from("next_test_user").select("*");

      if (error || !data || !data.length) {
        setError(
          "There are currently no test users available. Please try again another time",
        );
      } else {
        setUserId(data[0].user_id);
      }
    };

    getData();
  }, []);

  return (
    <>
      <Sheet
        sx={{
          width: 350,
          mx: "auto",
          my: 4,
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
        }}
        variant="outlined">
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          {!error && (
            <Typography level="body-sm">Sign in to continue.</Typography>
          )}
          {error && (
            <Alert sx={{ mt: 1 }} variant="solid" color="danger">
              {error}
              <Error fontSize="small" sx={{ float: "right" }} />
            </Alert>
          )}
        </div>
        <FormControl>
          <FormLabel>User ID</FormLabel>
          <Input type="text" name="userId" value={userId ?? ""} disabled />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password - enter anything"
            onKeyDown={(event) => event.key === "Enter" && login()}
            onInput={(event: any) => setPassword(event.target.value)}
          />
        </FormControl>

        <Button sx={{ mt: 1, display: "block" }} onClick={() => login()}>
          Log in
        </Button>

        <Typography level="body-xs">
          <em>
            This version of the app is not connected to a real backend, so all
            you have to do to continue is click login.
          </em>
        </Typography>
      </Sheet>

      <DisclaimerModal
        open={showDisclaimer}
        close={() => setShowDisclaimer(false)}
      />
    </>
  );
}
