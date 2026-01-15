import type { GeolocationPosition } from "@/entities/location/model/@x/weather";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { weatherQueryOptions } from "../api/queries";
import { getVillageFcstBaseTime } from "../lib/getBaseTime";

export function useWeatherSummary({ nx, ny }: GeolocationPosition) {
  const villageFcstParams = getVillageFcstBaseTime();

  const queries = useQueries({
    queries: [
      weatherQueryOptions.ncst({ nx, ny }),
      weatherQueryOptions.villageFcst({ nx, ny, ...villageFcstParams }),
      weatherQueryOptions.villageFcst({
        nx,
        ny,
        base_date: dayjs(villageFcstParams.base_date).subtract(1, "day").format("YYYYMMDD"),
        base_time: "2300",
        target_date: villageFcstParams.base_date,
      }), // 단기예보에 당일 최저기온이 포함 안되는 경우가 있어서 전날 단기예보 데이터를 사용하여 최저기온을 계산
    ],
  });

  const [
    { data: currentWeather, isLoading: currentWeatherLoading, isError: currentWeatherError },
    { data: villageCurrentQuery, isLoading: villageCurrentLoading, isError: villageCurrentError },
    { data: villagePrevQuery, isLoading: villagePrevLoading, isError: villagePrevError },
  ] = queries;

  return {
    currentTemp: currentWeather?.temperature ?? null,
    todayMinTemp: villageCurrentQuery?.daily.minTemp ?? villagePrevQuery?.daily.minTemp ?? null,
    todayMaxTemp: villageCurrentQuery?.daily.maxTemp ?? villagePrevQuery?.daily.maxTemp ?? null,
    isLoading: currentWeatherLoading || villageCurrentLoading || villagePrevLoading,
    isError: currentWeatherError || villageCurrentError || villagePrevError,
  };
}
