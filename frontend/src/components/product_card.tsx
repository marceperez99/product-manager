import { Button, Chip, Grid, Typography } from "@mui/material";
import { Product } from "../types/products.type";
import noImage from "../img/no-image.png";
import { useNavigate } from "react-router-dom";
const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      p={3}
      border={"1px solid lightgray"}
      borderRadius={3}
      bgcolor="white"
    >
      <Grid item xs={12} textAlign="center">
        <img
          height={"100px"}
          src={product?.images?.[0]?.image || noImage}
          alt="No product"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" textAlign="center">
          {product.name}
          <Chip
            size="small"
            sx={{ mx: 1 }}
            color={product.available ? "info" : "warning"}
            label={product.available ? "Active" : "Inactive"}
          />
        </Typography>
      </Grid>
      <Grid item xs={12} textAlign="center" mt={1}>
        {product.categories?.map((category) => (
          <Chip
            size="small"
            sx={{ mx: 1 }}
            key={category.id}
            label={category.name}
          />
        ))}
      </Grid>
      <Grid item xs={12} textAlign="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Edit
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProductCard;
