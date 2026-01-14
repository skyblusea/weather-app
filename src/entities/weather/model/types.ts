import type { PTY_CODES, SKY_CODES } from "./constants";

export interface WeatherSummary {
  condition: WeatherCondition;
  currentTemp: number;
  todayMinTemp: number;
  todayMaxTemp: number;
}

export type SkyCode = (typeof SKY_CODES)[keyof typeof SKY_CODES];
export type PTYCode = (typeof PTY_CODES)[keyof typeof PTY_CODES];

export type WeatherCondition = "SUNNY" | "PARTLY_CLOUDY" | "CLOUDY" | "RAIN" | "RAIN_SNOW" | "SNOW" | "SHOWER";
