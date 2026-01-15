import type { CurrentWeather, HourWeather } from "../model/types";
import { getWeatherCondition } from "./getWeatherCondition";
import { isValidHour } from "./isValidHour";

export function applyCurrentWeather(hourlyWeatherMap: Map<string, HourWeather>, currentWeather: CurrentWeather): void {
  const { temperature, baseTime, precipitationType } = currentWeather;

  if (temperature == null || !baseTime) return;

  const hh = baseTime.slice(0, 2);

  const existing = hourlyWeatherMap.get(hh);
  if (!existing || !isValidHour(hh)) return;

  existing.temperature = currentWeather.temperature;
  existing.condition = getWeatherCondition(1, precipitationType ?? 0);
  existing.source = "NCST_T1H";
}
