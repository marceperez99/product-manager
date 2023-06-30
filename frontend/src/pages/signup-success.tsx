import { Button, Container, Grid, Typography } from "@mui/material";

import { Navigate, useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";

const SignUpSuccess = () => {
  const navigate = useNavigate();
  const { loginState } = useAuthentication();

  if (loginState === "loggedIn") return <Navigate to="/" />;
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid>
        <Grid item>
          <Typography textAlign="center" variant="h3" mb={3}>
            User created successfully
          </Typography>
        </Grid>
        <Grid item>
          <Typography textAlign="center" variant="h6">
            Wait for an admin to activate your account
          </Typography>
        </Grid>
        <Grid item textAlign="center" mt={3}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate("/login")}
          >
            Go back to Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUpSuccess;
