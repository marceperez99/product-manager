import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import MultipleSelect from "../components/inputs/multiple-select";
import useCategories from "../hooks/useCategories";

type IProductForm = {
  name: string;
  available: boolean;
  categories: number[];
  images: { id?: string; image: string }[];
};
interface ProductFormProps {
  initialValues?: IProductForm;
  saveButtonLabel: string;
  onSubmit: (submittedValues: IProductForm) => void;
}
const ProductForm = ({
  initialValues = {
    name: "",
    available: false,
    categories: [],
    images: [],
  },
  onSubmit,
  saveButtonLabel,
}: ProductFormProps) => {
  const { data: categories } = useCategories();
  const { enqueueSnackbar } = useSnackbar();

  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    setValues,
    handleBlur,
    errors,
    touched,
  } = useFormik<IProductForm>({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (submittedValues, { setErrors }) => {
      try {
        await onSubmit(submittedValues);
      } catch (error: any) {
        const errors = error?.response?.data;
        setErrors(errors);
        enqueueSnackbar(errors?.detail || "Error while updating product", {
          variant: "error",
        });
      }
    },
  });
  console.log(values);

  return (
    <Box my={5}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Product Name"
            value={values.name}
            onChange={handleChange("name")}
            onBlur={handleBlur("name")}
            error={touched.name && !!errors.name}
            helperText={touched.name ? errors.name : ""}
          />
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={6} my={3}>
          <MultipleSelect
            title="Categories"
            values={values.categories.map((o) => `${o}`)}
            error={touched.categories ? errors.categories || "" : ""}
            setValues={(values) => setFieldValue("categories", values)}
            options={
              categories?.results.map((category) => ({
                id: `${category.id}`,
                value: category.name,
              })) || []
            }
          />
        </Grid>
        <Grid item xs={6} my={3}>
          <Typography>Status</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={values.available}
                  onChange={handleChange("available")}
                />
              }
              label="Available"
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Product Images</Typography>
      </Grid>
      <Grid item xs={12} p={3}>
        <Grid
          container
          spacing={3}
          borderRadius={3}
          border="1px solid lightgray"
          p={3}
          my={3}
        >
          {values.images.map((image, index) => (
            <Grid
              key={index}
              item
              xs={12}
              md={3}
              position="relative"
              textAlign="center"
              border="1px solid lightgray"
              borderRadius={3}
            >
              <IconButton
                onClick={() =>
                  setValues((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                  }))
                }
                sx={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                }}
              >
                <CloseIcon />
              </IconButton>

              <img
                src={image.image}
                alt={`Preview ${index + 1}`}
                style={{ width: "200px", height: "200px", margin: "10px" }}
              />
            </Grid>
          ))}
          <Grid item xs={12} textAlign="center">
            <Button variant="contained" component="label">
              Upload File
              <input
                accept="image/*"
                type="file"
                multiple
                hidden
                onChange={(event) => {
                  const files = event.target.files;
                  const imagesArray: (string | ArrayBuffer | null)[] = [];

                  for (let i = 0; i < (files?.length || 0); i++) {
                    if (!files?.[i]) continue;
                    const reader = new FileReader();
                    reader.readAsDataURL(files?.[i]);

                    reader.onload = () => {
                      //@ts-ignore
                      imagesArray.push({ image: reader.result });
                      if (imagesArray.length === files.length) {
                        //@ts-ignore
                        setValues((prev) => ({
                          ...prev,
                          images: [...prev.images, ...imagesArray],
                        }));
                      }
                    };
                  }
                }}
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} textAlign="center">
        <Button
          variant="contained"
          size="large"
          sx={{ maxWidth: "300px" }}
          fullWidth
          onClick={() => handleSubmit()}
        >
          {saveButtonLabel}
        </Button>
      </Grid>
    </Box>
  );
};

export default ProductForm;
