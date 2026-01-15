import type { HourlyWeather } from "@/entities/weather/model/types";
import { WeatherIcon } from "@/entities/weather/ui/WeatherIcon";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";

interface HourlyForecastProps {
  hourlyWeather: HourlyWeather;
}

export function HourlyForecast({ hourlyWeather }: HourlyForecastProps) {
  return (
    <Carousel>
      <CarouselContent>
        {Array.from(hourlyWeather.entries()).map(([time, { condition, temperature }]) => (
          <CarouselItem className="basis-1/6 md:basis-1/10" key={time}>
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-xs opacity-80">{time + "시"}</p>
              <WeatherIcon condition={condition} />
              <p className="font-bold">{temperature ? `${temperature}°` : "-°"}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
