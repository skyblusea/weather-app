import type { WeatherCondition } from "./types";

export function getWeatherCondition(sky: number, pty: number): WeatherCondition {
  // 강수 우선
  if (pty === 1 || pty === 5) return "RAIN";
  if (pty === 2 || pty === 6) return "RAIN_SNOW";
  if (pty === 3 || pty === 7) return "SNOW";
  if (pty === 4) return "SHOWER";

  // 강수 없음
  if (sky === 1) return "SUNNY";
  if (sky === 3) return "PARTLY_CLOUDY";
  if (sky === 4) return "CLOUDY";

  return "SUNNY";
}
