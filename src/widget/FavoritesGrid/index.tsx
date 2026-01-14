import type { Favorite } from "@/entities/favorite/model/types";
import { FavoriteCard } from "./FavoriteCard";

export function FavoritesGrid({ favorites }: { favorites: Favorite[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.location.path}
            favorite={favorite}
            isFavorite={true}
            onAdd={() => {}}
            onRemove={() => {}}
            weather={{
              condition: "SUNNY",
              currentTemp: 20,
              todayMinTemp: 10,
              todayMaxTemp: 30,
            }}
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
