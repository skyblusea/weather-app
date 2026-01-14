import type { WeatherCondition } from "@/entities/weather/model/types";
import { SearchBar } from "@/widget/DistrictSearchBar";
import { FavoritesGrid } from "@/widget/FavoritesGrid";
import { WeatherPanel } from "@/widget/WeatherPanel";
import type { HourlyWeather } from "@/widget/WeatherPanel/types";

export function HomePage() {
  const currentWeatherMock = {
    currentTemp: 1.4,
    todayMinTemp: 3,
    todayMaxTemp: 8,
    condition: "SUNNY" as WeatherCondition,
  };

  const currentLocationMock = {
    path: "서울특별시 광진구 광장동",
    code: "1121581000",
    gridX: 60,
    gridY: 126,
  };

  const hourlyWeatherMock = new Map<string, HourlyWeather>();
  for (let h = 0; h < 24; h++) {
    hourlyWeatherMock.set(h.toString(), {
      time: h.toString(),
      condition: "SUNNY",
      currentTemp: 0,
      source: "MISSING",
    });
  }

  return (
    <div className="mx-auto my-8 flex min-h-screen w-full max-w-lg flex-col gap-4 overflow-y-auto px-4">
      <WeatherPanel {...currentWeatherMock} locationName={currentLocationMock.path} hourlyWeather={hourlyWeatherMock} />
      <SearchBar />
      <FavoritesGrid favorites={[]} />
    </div>
  );
}
