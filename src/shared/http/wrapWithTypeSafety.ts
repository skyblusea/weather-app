import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const wrapWithTypeSafety = (axiosClient: AxiosInstance) => ({
  get: async <RQ, RS>(url: string, config?: AxiosRequestConfig<RQ>) => {
    return axiosClient.get<RQ, AxiosResponse<RS, RQ>, RQ>(url, {
      ...config,
    });
  },

  post: async <RQ, RS>(url: string, reqBody?: RQ, config?: AxiosRequestConfig<RQ>) => {
    return axiosClient.post<RQ, AxiosResponse<RS, RQ>, RQ>(url, reqBody, {
      ...config,
    });
  },

  patch: async <RQ, RS>(url: string, reqBody?: RQ, config?: AxiosRequestConfig<RQ>) => {
    return axiosClient.patch<RQ, AxiosResponse<RS, RQ>, RQ>(url, reqBody, {
      ...config,
    });
  },

  put: async <RQ, RS>(url: string, reqBody?: RQ, config?: AxiosRequestConfig<RQ>) => {
    return axiosClient.put<RQ, AxiosResponse<RS, RQ>, RQ>(url, reqBody, {
      ...config,
    });
  },

  delete: async <RQ, RS>(url: string, config?: AxiosRequestConfig<RQ>) => {
    return axiosClient.delete<RQ, AxiosResponse<RS, RQ>, RQ>(url, {
      ...config,
    });
  },
});

export default wrapWithTypeSafety;
