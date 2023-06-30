import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import ScreenLayout from "../components/screen_layout";
import useProducts from "../hooks/useProducts";
import ProductForm from "../components/product-form";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import { Product } from "../types/products.type";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";

const EditProduct = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const { id: productId } = useParams();
  const axios = useAxios();
  const { data, isLoading, error } = useQuery(["product", productId], () =>
    axios
      .get<Product>(`/api/products/${productId}/`)
      .then((response) => response.data)
  );

  const { enqueueSnackbar } = useSnackbar();
  const { update, deleteItem } = useProducts();

  const deleteProduct = async () => {
    try {
      if (productId) await deleteItem(productId);

      setDeleteModal(false);
      navigate("/");
      enqueueSnackbar("Product deleted", { variant: "success" });
    } catch (error: any) {
      const errorMessage = error?.response?.data;
      enqueueSnackbar(
        errorMessage?.detail ||
          errorMessage?.detail ||
          "Error while deleting product",
        { variant: "error" }
      );
    }
  };

  return (
    <ScreenLayout>
      <Container sx={{ mt: 3 }}>
        <Grid container>
          <Grid item xs={7}>
            <Typography variant="h5">Edit product</Typography>
          </Grid>
          <Grid item xs={5} textAlign="right">
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteModal(true)}
            >
              Delete product
            </Button>
            <Dialog
              open={deleteModal}
              onClose={() => setDeleteModal(false)}
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-description"
            >
              <DialogTitle id="delete-dialog-title">
                Want to delete this product?
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="delete-dialog-description">
                  This action is not reversible
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteModal(false)}>Cancel</Button>
                <Button color="error" onClick={() => deleteProduct()} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        {isLoading && (
          <Box textAlign="center" mt={5}>
            <CircularProgress />
          </Box>
        )}

        {!!error && (
          <Typography variant="h5" textAlign={"center"} mt={5}>
            {/* @ts-ignore */}
            {error?.response?.status === 404 ? "Product Not Found" : ""}
          </Typography>
        )}
        {data && (
          <ProductForm
            initialValues={{
              name: data.name,
              available: data.available,
              categories: data.categories.map((c) => c.id),
              images: data.images,
            }}
            saveButtonLabel="Edit Product"
            onSubmit={async (submittedValues) => {
              console.log({ submittedValues });

              await update(productId as string, submittedValues);
              navigate(-1);
              enqueueSnackbar("Product created", { variant: "success" });
            }}
          />
        )}
      </Container>
    </ScreenLayout>
  );
};

export default EditProduct;
