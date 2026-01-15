// - 하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4)
// - 강수형태(PTY) 코드 : (초단기) 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
//                       (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)

export const SKY_CODES = {
  CLEAR: 1,
  CLOUDY: 3,
  OVERCAST: 4,
} as const;

export const PTY_CODES = {
  NONE: 0,
  RAIN: 1,
  RAIN_SNOW: 2,
  SNOW: 3,
  RAIN_SHOWERS: 4,
  SNOW_SHOWERS: 5,
  RAIN_SNOW_SHOWERS: 6,
  SNOW_RAIN_SHOWERS: 7,
} as const;

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
