import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";

import { LogInSchema } from "../utils/validations";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import { useSnackbar } from "notistack";

const Login = () => {
  const { loginState, login } = useAuthentication();
  const { enqueueSnackbar } = useSnackbar();
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: async (submittedValues, { setErrors }) => {
      try {
        await login(submittedValues.username, submittedValues.password);
      } catch (error: any) {
        console.log(error?.response?.data);

        const errors = error?.response?.data;
        if (errors.detail) enqueueSnackbar(errors.detail, { variant: "error" });
        setErrors(errors);
      }
    },
    validationSchema: LogInSchema,
  });

  const navigate = useNavigate();
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
      <Grid
        container
        boxShadow={1}
        height="50%"
        minHeight="500px"
        width="100%"
        borderRadius={3}
        p={4}
      >
        <Grid item xs={12}>
          <Typography variant="h5" textAlign="center">
            Login
          </Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            placeholder="Username"
            value={values.username}
            onChange={handleChange("username")}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            placeholder="Password"
            value={values.password}
            type="password"
            onChange={handleChange("password")}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ maxWidth: "300px" }}
            onClick={() => handleSubmit()}
          >
            Log In
          </Button>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="text"
            size="large"
            sx={{ maxWidth: "300px" }}
            fullWidth
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
