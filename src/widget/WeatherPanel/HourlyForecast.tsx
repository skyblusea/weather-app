import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import type { HourlyWeatherMap } from "./types";

interface HourlyForecastProps {
  hourlyWeather: HourlyWeatherMap;
}

export function HourlyForecast({ hourlyWeather }: HourlyForecastProps) {
  return (
    <Carousel>
      <CarouselContent>
        {Array.from(hourlyWeather.entries()).map(([time, { condition, currentTemp }]) => (
          <CarouselItem className="basis-1/6 md:basis-1/10" key={time}>
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-xs opacity-80">{time + "시"}</p>
              <WeatherIcon condition={condition} />
              <p className="font-bold">{currentTemp}°</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
