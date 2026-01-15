import type { Location } from "@/entities/location/model/types";
import { useCurrentLocation } from "@/entities/location/model/useCurrentLocation";
import { DistrictSearchBar } from "@/features/search-location/ui/DistrictSearchBar";
import { FavoritesGrid } from "@/widget/FavoritesGrid";
import { WeatherPanel } from "@/widget/WeatherPanel";
import { useState } from "react";

export function HomePage() {
  const { currentLocation } = useCurrentLocation();

  const [selectedLocation, setSelectedLocation] = useState<Location>({
    ...currentLocation,
  });

  return (
    <div className="mx-auto my-8 flex min-h-screen w-full max-w-lg flex-col gap-4 overflow-y-auto px-4">
      <WeatherPanel {...selectedLocation} />
      <DistrictSearchBar onLocationSelect={setSelectedLocation} />
      <FavoritesGrid />
    </div>
  );
}
