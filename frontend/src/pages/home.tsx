import { Navigate, useNavigate } from "react-router-dom";
import useAuthentication from "../hooks/useAuthentication";
import * as _ from "lodash";
import Typography from "@mui/material/Typography";
import * as qs from "qs";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ScreenLayout from "../components/screen_layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import config from "../config";
import useAxios from "../hooks/useAxios";
import { PaginatedData } from "../types/paginated-data.type";
import { Product } from "../types/products.type";
import ProductCard from "../components/product_card";
import useCategories from "../hooks/useCategories";
import { useCallback, useState } from "react";
import MultipleSelect from "../components/inputs/multiple-select";
import { Clear } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { loginState } = useAuthentication();
  const [filters, setFilters] = useState({
    name: "",
    available: "",
    categories: [],
  });
  const { data: categories } = useCategories();
  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery(
    ["products", filters],
    ({ pageParam = `${config.apiEndpoint}/api/products/?page=1` }) =>
      axios
        .get<PaginatedData<Product>>(`${pageParam}&search=${filters.name}`, {
          params: _.omitBy(
            {
              available:
                filters.available !== ""
                  ? filters.available === "active"
                  : null,
              categories: filters.categories,
            },
            _.isNull
          ),
          paramsSerializer: (params) => qs.stringify(params),
        })
        .then((res) => res.data),
    {
      getNextPageParam: (lastPage) => lastPage.next,
    }
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateName = useCallback(
    _.debounce(
      (e: any) => setFilters((prev) => ({ ...prev, name: e.target.value })),
      500
    ),
    []
  );

  if (loginState === "loggedOut") return <Navigate to="/login" />;
  const products = data?.pages.map((page) => page.results).flat();

  return (
    <ScreenLayout>
      <Container sx={{ marginY: "32px" }}>
        <Grid container borderBottom={"1px solid lightgray"} mb={4} pb={4}>
          <Grid item xs={6} px={2}>
            <Typography variant="h4">Product List</Typography>
          </Grid>
          <Grid item xs={6} px={2} textAlign="right">
            <Button
              onClick={() => navigate("/product/new")}
              variant="contained"
            >
              Create Product
            </Button>
          </Grid>
          <Grid item xs={12} md={4} p={2}>
            <TextField
              fullWidth
              placeholder="Product Name"
              onChange={debouncedUpdateName}
            />
          </Grid>
          <Grid item xs={12} md={3} p={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                fullWidth
                labelId="status-label"
                label="Status"
                value={filters.available}
                endAdornment={
                  <IconButton
                    sx={{ mr: 1 }}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        available: "",
                      }))
                    }
                  >
                    <Clear fontSize={"small"} />
                  </IconButton>
                }
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, available: e.target.value }))
                }
              >
                <MenuItem value={"active"}>Active</MenuItem>
                <MenuItem value={"not_active"}>Not Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} p={2}>
            <MultipleSelect
              title="Categories"
              values={filters.categories}
              setValues={(values) =>
                //@ts-ignore
                setFilters((prev) => ({ ...prev, categories: values }))
              }
              options={
                categories?.results.map((category) => ({
                  id: category.id,
                  value: category.name,
                })) || []
              }
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} textAlign="center">
            {isLoading && <CircularProgress />}
          </Grid>

          {products?.map((p) => (
            <Grid key={p.id} item xs={4} p={1}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} textAlign="center">
          {hasNextPage && (
            <Button
              variant="contained"
              size="large"
              sx={{ maxWidth: "300px" }}
              fullWidth
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          )}
        </Grid>
      </Container>
    </ScreenLayout>
  );
};

export default Home;
