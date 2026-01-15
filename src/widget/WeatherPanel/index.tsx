import type { Location } from "@/entities/location/model/types";
import { useWeatherDetail } from "@/entities/weather/model/useWeatherDetail";
import { FavoriteButton } from "@/features/toggle-favorite/ui/FavoriteButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@base-ui/react/separator";
import { MapPin } from "lucide-react";
import { HourlyForecast } from "./HourlyForecast";

export function WeatherPanel({ id, name, nx, ny }: Location) {
  const { currentTemp, todayMinTemp, todayMaxTemp, hourlyWeather, isError } = useWeatherDetail({ nx, ny });

  return (
    <Card
      className={`mx-auto w-full max-w-2xl border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white ${isError ? "bg-red-500" : ""}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center text-xl font-bold">
          <MapPin className="mr-2" /> {name}
        </CardTitle>
        <FavoriteButton location={{ id, name, nx, ny }} color="white" disabled={isError} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="relative">
              <div className={`text-6xl font-bold ${isError && "opacity-0"}`}>{currentTemp ?? 0}°</div>
            </div>
            <div className={`text-sm opacity-80 ${isError && "font-bold opacity-100"}`}>
              {isError ? (
                <>해당 장소의 정보가 제공되지 않습니다.</>
              ) : (
                <>
                  최저 {todayMinTemp ? Math.round(todayMinTemp) : "-"}° / 최고{" "}
                  {todayMaxTemp ? Math.round(todayMaxTemp) : "-"}°
                </>
              )}
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" className="my-4 h-px bg-white/20" />
        <HourlyForecast hourlyWeather={hourlyWeather} />
      </CardContent>
    </Card>
  );
}
