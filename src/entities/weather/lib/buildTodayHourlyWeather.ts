import { kst } from "@/shared/lib/dayjs";
import type { CurrentWeather, ForecastWeather, HourlyForecast, HourWeather } from "../model/types";
import { applyCurrentWeather } from "./applyCurrentWeather";
import { getWeatherCondition } from "./getWeatherCondition";
import { isValidHour } from "./isValidHour";

type BuildTodayHourlyProps = {
  now?: Date;
  // 1) 단기예보(뼈대): getVillageFcst category=TMP
  hourlyForecast?: HourlyForecast[];
  // 2) 초단기실황(현재 실측): getUltraSrtNcst category=T1H
  currentWeather?: CurrentWeather;
  // 3) 초단기예보(가까운 미래): getUltraSrtFcst category=T1H
  forecastWeather?: ForecastWeather[];
};

/**
 * 오늘 00~23시 시간대별 기온 24개 만들기
 * - base: getVillageFcst(TMP, 오늘)
 * - overlay: getUltraSrtNcst(T1H)  (실제 관측된 값)
 */
export function buildTodayHourlyWeather({
  hourlyForecast,
  currentWeather,
  forecastWeather,
}: BuildTodayHourlyProps): Map<string, HourWeather> {
  const now = kst();
  const today = now.format("YYYYMMDD");

  // 00~23시 시간대별 빈 Map
  const result = new Map<string, HourWeather>();
  for (let h = 0; h < 24; h++) {
    const dt = now.startOf("day").add(h, "hour");
    const hour = dt.format("HH");
    result.set(hour, {
      fcstDate: today,
      fcstTime: hour,
      temperature: undefined,
      condition: "SUNNY", // 기본값
      source: "MISSING",
    });
  }

  if (hourlyForecast?.length) {
    // 단기예보 TMP로 오늘 24시간 채우기
    for (const item of hourlyForecast) {
      // fcstDate가 오늘인 것만 사용
      if (item.fcstDate !== today) continue;

      const hh = item.fcstTime.slice(0, 2);
      if (!isValidHour(hh)) continue;

      const existing = result.get(hh);
      if (existing) {
        if (item.temperature != null) {
          existing.temperature = item.temperature;
        }
        // sky, pty 값으로 condition 계산
        const sky = item.skyState ?? 1;
        const pty = item.precipitationType ?? 0;
        existing.condition = getWeatherCondition(sky, pty);
        existing.source = "VILAGE_TMP";
      }
    }
  }
  // 초단기예보로 현재 시각 기준 6시간만 제공되므로 해당 시간만 덮어씀
  if (forecastWeather?.length) {
    for (const item of forecastWeather) {
      if (item.fcstDate !== today) continue;

      const hh = item.fcstTime.slice(0, 2);
      if (!isValidHour(hh)) continue;

      const existing = result.get(hh);
      if (existing) {
        if (item.temperature != null) {
          existing.temperature = item.temperature;
        }
        // sky, pty 값으로 condition 계산
        const sky = item.skyState ?? 1;
        const pty = item.precipitationType ?? 0;
        existing.condition = getWeatherCondition(sky, pty);
        existing.source = "FCST_T1H";
      }
    }
  }

  if (currentWeather) {
    //초단기실황으로 현재 시각 덮어쓰기
    applyCurrentWeather(result, currentWeather);
  }

  return result;
}
