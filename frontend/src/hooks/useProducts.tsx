import { useCallback } from "react";
import useAxios from "./useAxios";

export default function useProducts() {
  const axios = useAxios();

  const create = useCallback(
    async (data: any) => {
      try {
        await axios.post("/api/products/", data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [axios]
  );
  const update = useCallback(
    async (id: string, data: any) => {
      try {
        await axios.patch(`/api/products/${id}/`, data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [axios]
  );
  const deleteItem = useCallback(
    async (id: string) => {
      try {
        await axios.delete(`/api/products/${id}/`);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    [axios]
  );

  return { create, update, deleteItem };
}
