import { useFavoritesStore } from "@/entities/favorite/lib/store";
import { useWeatherSummary } from "@/entities/weather/model/useWeatherSummary";
import { FavoriteCard } from "./FavoriteCard";

export function FavoritesGrid() {
  const { favorites } = useFavoritesStore();

  const weatherSummaries = useWeatherSummary(
    favorites.map((favorite) => ({ nx: favorite.location.nx, ny: favorite.location.ny })),
  );

  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {favorites.length > 0 ? (
        favorites.map((favorite, index) => (
          <FavoriteCard
            key={favorite.location.id}
            favorite={favorite}
            isFavorite={true}
            weather={weatherSummaries[index]}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-muted-foreground">즐겨찾기가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
