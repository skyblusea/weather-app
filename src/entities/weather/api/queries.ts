import { queryOptions } from "@tanstack/react-query";
import { getNcsBaseTime } from "../lib/getBaseTime.ts";
import { parseCurrentWeather, parseDailyWeather, parseHourlyForecast } from "../lib/parser.ts";
import type { WeatherRequestParams } from "../model/types.ts";
import { getFcst, getNcst, getVillageFcst } from "./requests.ts";

export const weatherQueryOptions = {
  history: ({ nx, ny, base_date, base_time }: WeatherRequestParams) =>
    queryOptions({
      queryKey: ["weather", "history", { nx, ny }, base_date, base_time], // 현재 날씨라는 목적성에 맞게 쿼리 키에 시간 관련 파라미터는 없애고, 리프레시 정책으로 통제
      queryFn: async () => {
        const items = await getNcst({ nx, ny, base_date, base_time });
        return parseCurrentWeather(items, base_date, base_time);
      },
      staleTime: Infinity, // 과거 데이터는 불변
      gcTime: Infinity,
    }),
  ncst: ({ nx, ny }: Omit<WeatherRequestParams, "base_date" | "base_time">) =>
    queryOptions({
      queryKey: ["weather", "ncst", { nx, ny }], // 현재 날씨라는 목적성에 맞게 쿼리 키에 시간 관련 파라미터는 없애고, 리프레시 정책으로 통제
      queryFn: async () => {
        // refetchInterval로 주기적 갱신하므로 매 fetch마다 최신 시간 계산
        const { base_date, base_time } = getNcsBaseTime();
        const items = await getNcst({ nx, ny, base_date, base_time });
        return parseCurrentWeather(items, base_date, base_time);
      },
      staleTime: 5 * 60 * 1000, // 현재 날씨는 실시간 데이터이므로, 캐시 데이터 삭제 즉시 다시 요청
      refetchInterval: 10 * 60 * 1000,
      gcTime: 10 * 60 * 1000, // 현재 날씨는 10분마다 갱신되므로, 10분 후에 캐시 데이터 삭제
      refetchOnWindowFocus: true, // refetchInterval은 “활성 상태에서만”돌다 보니 백그라운드로 가 있는 동안 interval이 동작하지 않음. refetchOnWindowFocus로 보완
    }),
  fcst: ({ nx, ny, base_date, base_time }: WeatherRequestParams) =>
    queryOptions({
      queryKey: ["weather", "fcst", { nx, ny }, base_date, base_time],
      queryFn: async () => {
        const items = await getFcst({ nx, ny, base_date, base_time });
        return parseHourlyForecast(items, base_date);
      },
      staleTime: 10 * 60 * 1000, // 10분마다 업데이트 되므로
      gcTime: 30 * 60 * 1000,
    }),

  villageFcst: ({ nx, ny, base_date, base_time, target_date }: WeatherRequestParams & { target_date?: string }) =>
    queryOptions({
      queryKey: ["weather", "villageFcst", { nx, ny }, base_date, base_time],
      queryFn: async () => {
        const items = await getVillageFcst({ nx, ny, base_date, base_time });

        return {
          hourly: parseHourlyForecast(items, target_date ?? base_date),
          daily: parseDailyWeather(items, target_date ?? base_date),
        };
      },
      staleTime: Infinity, // 발표 시각 이후 불변 데이터
      gcTime: Infinity, // 앱 생명주기 동안 계속 재사용
    }),
};
