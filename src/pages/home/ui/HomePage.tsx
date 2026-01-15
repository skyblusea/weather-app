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
    <>
      <WeatherPanel {...selectedLocation} />
      <DistrictSearchBar onLocationSelect={setSelectedLocation} />
      <FavoritesGrid />
    </>
  );
}
