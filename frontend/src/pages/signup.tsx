import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import { SignUp } from "../types/sign-up.type";
import { SignUpSchema } from "../utils/validations";

const SignUpPage = () => {
  const { loginState, signup } = useAuthentication();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    values,
    isValid,
    handleChange,
    errors,
    handleBlur,
    touched,
    handleSubmit,
    isSubmitting,
  } = useFormik<SignUp & { confirmPassword: string }>({
    initialValues: {
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (submittedValues, { setErrors }) => {
      try {
        await signup(submittedValues);
        navigate("/signup-success");
      } catch (e: any) {
        const errors = e?.response?.data;
        setErrors(errors);
        enqueueSnackbar("Error when creating user", { variant: "error" });
      }
    },
  });

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
        minHeight="500px"
        width="100%"
        borderRadius={3}
        p={4}
      >
        <Grid item my={1} xs={12}>
          <Typography variant="h5" textAlign="center">
            Login
          </Typography>
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            label="Username"
            onBlur={handleBlur("username")}
            error={touched.username && !!errors.username}
            helperText={touched.username ? errors.username : ""}
            value={values.username}
            onChange={handleChange("username")}
          />
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            label="Email"
            onBlur={handleBlur("email")}
            value={values.email}
            error={touched.email && !!errors.email}
            helperText={touched.email ? errors.email : ""}
            type="email"
            onChange={handleChange("email")}
          />
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            label="Password"
            onBlur={handleBlur("password")}
            value={values.password}
            error={touched.password && !!errors.password}
            helperText={touched.password ? errors.password : ""}
            type="password"
            onChange={handleChange("password")}
          />
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <TextField
            fullWidth
            sx={{ maxWidth: "400px" }}
            onBlur={handleBlur("confirmPassword")}
            label="Confirm Password"
            value={values.confirmPassword}
            error={touched.confirmPassword && !!errors.confirmPassword}
            helperText={touched.confirmPassword ? errors.confirmPassword : ""}
            type="password"
            onChange={handleChange("confirmPassword")}
          />
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ maxWidth: "300px" }}
            disabled={isSubmitting || !isValid}
            onClick={() => handleSubmit()}
          >
            Sign up
          </Button>
        </Grid>
        <Grid item my={1} xs={12} textAlign="center">
          <Button
            variant="text"
            size="large"
            sx={{ maxWidth: "300px" }}
            fullWidth
            onClick={() => navigate("/login")}
          >
            Log into Account
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUpPage;
