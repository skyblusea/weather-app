import createAxiosInstance from "./createAxiosInstance";
import wrapWithTypeSafety from "./wrapWithTypeSafety";

const axiosInstance = createAxiosInstance();
export const httpClient = wrapWithTypeSafety(axiosInstance);
