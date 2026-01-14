import type { WeatherCondition } from "./types";

export const WEATHER_ICON_SPRITE_MAP: Record<WeatherCondition, { posX: string; posY: string }> = {
  SUNNY: {
    posX: "0%",
    posY: "0%",
  },
  PARTLY_CLOUDY: {
    posX: "100%",
    posY: "20%",
  },
  CLOUDY: {
    posX: "100%",
    posY: "60%",
  },
  RAIN: {
    posX: "100%",
    posY: "100%",
  },
  RAIN_SNOW: {
    posX: "33.33333%",
    posY: "20%",
  },
  SNOW: {
    posX: "16.66667%",
    posY: "20%",
  },
  SHOWER: {
    posX: "0%",
    posY: "40%",
  },
};
