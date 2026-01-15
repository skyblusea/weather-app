import type { GeolocationPosition } from "@/entities/location/model/@x/weather";
import { useQueries } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo } from "react";
import { weatherQueryOptions } from "../api/queries";
import { applyCurrentWeather } from "../lib/applyCurrentWeather";
import { buildTodayHourlyWeather } from "../lib/buildTodayHourlyWeather";
import { getFcsBaseTime, getVillageFcstBaseTime } from "../lib/getBaseTime";

export function useWeatherDetail({ nx, ny }: GeolocationPosition) {
  const fcstParams = getFcsBaseTime();
  const villageFcstParams = getVillageFcstBaseTime();

  /**
   * 1단계: 기본 날씨 데이터 병렬 조회
   * - ncst: 현재 실황 (가장 정확)
   * - fcst: 초단기예보 (현재~6시간)
   * - villageFcst 현재일: 단기예보 (오늘~모레)
   * - villageFcst 전날: 당일 최저기온 보완용
   */
  const queries = useQueries({
    queries: [
      weatherQueryOptions.ncst({ nx, ny }),
      weatherQueryOptions.fcst({ nx, ny, ...fcstParams }),
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
    { data: forecastWeather, isLoading: forecastWeatherLoading, isError: forecastWeatherError },
    { data: villageCurrentQuery, isLoading: villageCurrentLoading, isError: villageCurrentError },
    { data: villagePrevQuery, isLoading: villagePrevLoading, isError: villagePrevError },
  ] = queries;

  /**
   * 2단계: 기본 시간대별 기온 생성
   *
   * 우선순위:
   * 1. ncst (초단기실황) - 현재 시각만, 실측이므로 가장 정확
   * 2. fcst (초단기예보) - 현재~6시간, 가까운 미래라 정확
   * 3. villageFcst (단기예보) - 오늘 전체, 기본 뼈대
   */
  const baseHourlyWeather = useMemo(() => {
    return buildTodayHourlyWeather({
      hourlyForecast: villageCurrentQuery?.hourly,
      currentWeather: currentWeather,
      forecastWeather: forecastWeather,
    });
  }, [currentWeather, forecastWeather, villageCurrentQuery]);

  /**
   * 3단계: 빈 시간대 찾아서 보완 쿼리 준비
   *
   * 예보 데이터는 미래만 제공하므로 과거 시간대가 비어있음
   * 예: 14:10 조회 시
   *   - 단기예보(11시 발표): 11시 이후 데이터만 존재
   *   - 00~10시 데이터 없음
   *   → 과거 실황(history)으로 채움
   */
  const historyQueryOptions = useMemo(() => {
    return Array.from(baseHourlyWeather.values())
      .filter((data) => data.temperature === undefined && data.source === "MISSING")
      .map((data) =>
        weatherQueryOptions.history({
          nx,
          ny,
          base_date: data.fcstDate,
          base_time: `${data.fcstTime}00`, // "HH" → "HH00"
        }),
      );
  }, [baseHourlyWeather, nx, ny]);

  /**
   * 4단계: 과거 실황 데이터 병렬 조회
   *
   * 빈 시간대(과거)마다 개별 실황 API 호출
   * React Query가 자동으로 병렬 처리 및 캐싱
   */
  const historyQueries = useQueries({
    queries: historyQueryOptions,
  });

  /**
   * 5단계: 모든 history 쿼리 완료 여부 확인
   *
   * true 조건:
   * - 빈 시간대가 없거나 (length === 0)
   * - 모든 history 쿼리가 완료됨 (isFetched)
   */
  const isHistoryComplete = useMemo(() => {
    if (historyQueries.length === 0) return true; // 빈 시간대 없으면 완료
    return historyQueries.every((q) => q.isFetched); // 모든 쿼리 완료
  }, [historyQueries]);

  /**
   * 6단계: 최종 시간대별 기온 생성
   *
   * 전략:
   * - history 완료 전: baseHourlyWeather 그대로 반환 (빠른 렌더링)
   * - history 완료 후: 빈 시간대(과거)를 history 데이터로 채워서 반환
   */
  const hourlyWeather = useMemo(() => {
    // 잦은 리렌더링을 방지하기 위해서 history 로딩 중이면 기본 데이터만 반환
    if (!isHistoryComplete) {
      return baseHourlyWeather;
    }
    const merged = new Map(baseHourlyWeather);

    for (const query of historyQueries) {
      if (!query.data || query.data.temperature == null) continue;
      applyCurrentWeather(merged, query.data);
    }

    return merged;
  }, [baseHourlyWeather, historyQueries, isHistoryComplete]);

  return {
    currentTemp: currentWeather?.temperature,
    todayMinTemp: villageCurrentQuery?.daily.minTemp ?? villagePrevQuery?.daily.minTemp,
    todayMaxTemp: villageCurrentQuery?.daily.maxTemp ?? villagePrevQuery?.daily.maxTemp,
    hourlyWeather, // 시간대별 기온 (00~23시, 과거는 실황으로 보완)
    isLoading: currentWeatherLoading || forecastWeatherLoading || villageCurrentLoading || villagePrevLoading,
    isHistoryLoading: !isHistoryComplete,
    isError: currentWeatherError || forecastWeatherError || villageCurrentError || villagePrevError,
  };
}
