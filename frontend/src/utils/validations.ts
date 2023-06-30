import * as Yup from "yup";
export const LogInSchema = Yup.object().shape({
  username: Yup.string().required("Field required"),
  password: Yup.string().required("Field required"),
});

export const SignUpSchema = Yup.object().shape({
  email: Yup.string().email().required("Field required"),
  username: Yup.string().required("Field required"),
  password: Yup.string().required("Field required"),
  confirmPassword: Yup.string()
    .required("Field required")
    .oneOf([Yup.ref("password")], "Passwords don't match!"),
});
