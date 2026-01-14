import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import headerConfigs from "./headers";

const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.defaults.headers.common = headerConfigs.default;

  // Request
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Response
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      return Promise.reject(error);
    },
  );
};

export default setupInterceptors;
