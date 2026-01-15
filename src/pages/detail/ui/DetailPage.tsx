import { useFavoritesStore } from "@/entities/favorite/lib/store";
import { WeatherPanel } from "@/widget/WeatherPanel";
import { useSearchParams } from "react-router";
export function DetailPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";

  const { getFavorite } = useFavoritesStore();

  const locationData = getFavorite(code);

  if (!code || !locationData) {
    return <div className="mx-auto my-8 flex min-h-screen w-full max-w-lg flex-col gap-4 overflow-y-auto px-4"></div>;
  }

  return (
    <WeatherPanel
      {...locationData.location}
      name={locationData.nickname ?? locationData.location.name}
      disableFavoriteButton={true}
      showEditNameButton={true}
    />
  );
}
