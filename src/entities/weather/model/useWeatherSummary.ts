import type { GeolocationPosition } from "@/entities/location/model/@x/weather";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { weatherQueryOptions } from "../api/queries";
import { getVillageFcstBaseTime } from "../lib/getBaseTime";
import type { WeatherSummary } from "./types";

function createWeatherQueries(positions: GeolocationPosition[]) {
  const villageFcstParams = getVillageFcstBaseTime();

  return positions.flatMap(({ nx, ny }) => [
    weatherQueryOptions.ncst({ nx, ny }),
    weatherQueryOptions.villageFcst({ nx, ny, ...villageFcstParams }),
    weatherQueryOptions.villageFcst({
      nx,
      ny,
      base_date: dayjs(villageFcstParams.base_date).subtract(1, "day").format("YYYYMMDD"),
      base_time: "2300",
      target_date: villageFcstParams.base_date,
    }), // 단기예보에 당일 최저기온이 포함 안되는 경우가 있어서 전날 단기예보 데이터를 사용하여 최저기온을 계산
  ]);
}

export function useWeatherSummary(positions: GeolocationPosition[]): WeatherSummary[] {
  const queries = useQueries({
    queries: createWeatherQueries(positions),
  });

  const summaries: WeatherSummary[] = positions.map((_, index) => {
    const baseIndex = index * 3;
    const currentWeatherQuery = queries[baseIndex];
    const villageCurrentQuery = queries[baseIndex + 1];
    const villagePrevQuery = queries[baseIndex + 2];

    const currentWeather = currentWeatherQuery.data;
    const villageCurrent = villageCurrentQuery.data;
    const villagePrev = villagePrevQuery.data;

    const villageCurrentDaily = villageCurrent && "daily" in villageCurrent ? villageCurrent.daily : null;
    const villagePrevDaily = villagePrev && "daily" in villagePrev ? villagePrev.daily : null;

    return {
      currentTemp: currentWeather && "temperature" in currentWeather ? currentWeather.temperature : null,
      todayMinTemp: villageCurrentDaily?.minTemp ?? villagePrevDaily?.minTemp ?? null,
      todayMaxTemp: villageCurrentDaily?.maxTemp ?? villagePrevDaily?.maxTemp ?? null,
      isLoading: currentWeatherQuery.isLoading || villageCurrentQuery.isLoading || villagePrevQuery.isLoading,
      isError: currentWeatherQuery.isError || villageCurrentQuery.isError || villagePrevQuery.isError,
    };
  });

  return summaries;
}
