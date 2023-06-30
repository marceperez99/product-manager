import axios from "axios";

import { useMemo } from "react";

import config from "../config";

const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: config.apiEndpoint,
      timeout: 1500000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(async (request) => {
      try {
        const token = localStorage.getItem("token");

        if (token)
          if (request.headers)
            request.headers["Authorization"] = `Bearer ${token}`;
      } catch (e: any) {
        console.log(e);
      }

      return request;
    });

    return instance;
  }, []);

  return axiosInstance;
};

export default useAxios;
