import type { WeatherSummary } from "@/entities/weather/model/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@base-ui/react/separator";
import { Crosshair, Heart, MapPin } from "lucide-react";
import { HourlyForecast } from "./HourlyForecast";
import type { HourlyWeatherMap } from "./types";

interface WeatherPanelProps extends WeatherSummary {
  locationName: string;
  hourlyWeather: HourlyWeatherMap;
}

export function WeatherPanel({
  condition,
  currentTemp,
  todayMinTemp,
  todayMaxTemp,
  locationName,
  hourlyWeather,
}: WeatherPanelProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center text-xl font-bold">
          <MapPin className="mr-2" /> {locationName} <Crosshair className="ml-2" />
        </CardTitle>
        <Heart className="text-white" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="relative">
              <div className="text-6xl font-bold">{Math.round(currentTemp)}°</div>
            </div>
            <div className="text-sm opacity-80">
              최저 {Math.round(todayMinTemp)}° / 최고 {Math.round(todayMaxTemp)}°
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" className="my-4 h-px bg-white/20" />
        <HourlyForecast hourlyWeather={hourlyWeather} />
      </CardContent>
    </Card>
  );
}
