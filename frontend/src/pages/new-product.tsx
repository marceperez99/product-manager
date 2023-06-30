import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ScreenLayout from "../components/screen_layout";
import useProducts from "../hooks/useProducts";
import ProductForm from "../components/product-form";
import { Container, Typography } from "@mui/material";

const NewProduct = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { create } = useProducts();

  return (
    <ScreenLayout>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h5">New product</Typography>

        <ProductForm
          saveButtonLabel="Create Product"
          onSubmit={async (submittedValues) => {
            await create(submittedValues);
            navigate(-1);
            enqueueSnackbar("Product created", { variant: "success" });
          }}
        />
      </Container>
    </ScreenLayout>
  );
};

export default NewProduct;
