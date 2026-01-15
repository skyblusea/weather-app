import { httpClient } from "@/shared/http";
import type { KmaLocation } from "../model/types";

export const getKmaLocations = async () => {
  const { data } = await httpClient.get<null, KmaLocation[]>("/kma_korea_location.json", {
    baseURL: "/data",
  });
  return data;
};
