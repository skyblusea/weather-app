import type { Favorite } from "@/entities/favorite/model/types";
import type { WeatherSummary } from "@/entities/weather/model/types";
import { FavoriteButton } from "@/features/toggle-favorite/ui/FavoriteButton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { useNavigate } from "react-router";

interface FavoriteCardProps {
  favorite: Favorite;
  isFavorite: boolean;
  weather: WeatherSummary;
}

export function FavoriteCard({ favorite, weather }: FavoriteCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail?code=${favorite.location.id}`, { state: { favorite } });
  };

  return (
    <Card
      className="relative cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold">{favorite.nickname || favorite.location.name}</p>
          {favorite.nickname && <p className="text-muted-foreground text-xs">{favorite.location.name}</p>}
        </div>
        <div className="favorite-heart group">
          <FavoriteButton location={favorite.location} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{weather.currentTemp !== null ? `${weather.currentTemp}°` : "-°"}</p>
        <p className="text-muted-foreground text-sm">
          최저 {weather.todayMinTemp !== null ? `${weather.todayMinTemp}°` : "-°"} / 최고{" "}
          {weather.todayMaxTemp !== null ? `${weather.todayMaxTemp}°` : "-°"}
        </p>
      </CardContent>
    </Card>
  );
}
