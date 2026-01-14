import { WEATHER_ICON_SPRITE_MAP } from "../model/spriteMap";
import type { WeatherCondition } from "../model/types";

type WeatherIconProps = {
  condition: WeatherCondition;
  size?: number;
};

export function WeatherIcon({ condition, size = 30 }: WeatherIconProps) {
  const { posX, posY } = WEATHER_ICON_SPRITE_MAP[condition];

  return (
    <span
      role="img"
      aria-label={condition.toLowerCase()}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundImage: "url(/images/weather_icon.png)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: `${posX} ${posY}`,
        backgroundSize: "210px 180px",
      }}
    />
  );
}
