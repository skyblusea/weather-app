import { queryOptions } from "@tanstack/react-query";
import { getKmaLocations } from "./request";

const ROOT_KEY = "kmaLocation";

export const locationQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: [ROOT_KEY, "list"],
      queryFn: () => getKmaLocations(),
      staleTime: Infinity,
      gcTime: Infinity,
    }),
};
