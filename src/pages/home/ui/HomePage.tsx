import type { Location } from "@/entities/location/model/types";
import { useCurrentLocation } from "@/entities/location/model/useCurrentLocation";
import { SearchBar } from "@/widget/DistrictSearchBar";
import { FavoritesGrid } from "@/widget/FavoritesGrid";
import { WeatherPanel } from "@/widget/WeatherPanel";
import { useState } from "react";

export function HomePage() {
  const { currentLocation } = useCurrentLocation();

  const [selectedLocation, setSelectedLocation] = useState<Location>({
    nx: currentLocation.nx,
    ny: currentLocation.ny,
    name: currentLocation.name,
  });

  return (
    <div className="mx-auto my-8 flex min-h-screen w-full max-w-lg flex-col gap-4 overflow-y-auto px-4">
      <WeatherPanel {...selectedLocation} />
      <SearchBar />
      <FavoritesGrid favorites={[]} />
    </div>
  );
}
