import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/category.type";
import { PaginatedData } from "../types/paginated-data.type";
import useAxios from "./useAxios";

export default function useCategories() {
  const axios = useAxios();
  return useQuery(["categories"], () =>
    axios
      .get<PaginatedData<Category>>("/api/categories")
      .then((res) => res.data)
  );
}
