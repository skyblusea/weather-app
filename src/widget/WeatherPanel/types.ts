import type { WeatherSummary } from "@/entities/weather/model/types";

export type HourlyWeather = {
  time: string;
  source: "VILAGE_TMP" | "FCST_T1H" | "NCST_T1H" | "MISSING";
} & Pick<WeatherSummary, "condition" | "currentTemp">;

export type HourlyWeatherMap = Map<string, HourlyWeather>;
