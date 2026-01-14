import axios from "axios";
import setupInterceptors from "./config/interceptors";

const createAxiosInstance = (baseURL?: string) => {
  const axiosInstance = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  });

  setupInterceptors(axiosInstance);

  return axiosInstance;
};

export default createAxiosInstance;
