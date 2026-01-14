import type { Favorite } from "@/entities/favorite/model/types";
import type { WeatherSummary } from "@/entities/weather/model/types";
import { Card, CardHeader } from "@/shared/ui/card";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface FavoriteCardProps {
  favorite: Favorite;
  isFavorite: boolean;
  onAdd: () => void;
  onRemove: () => void;
  weather: WeatherSummary;
}

export function FavoriteCard({ favorite, isFavorite, onAdd, onRemove, weather }: FavoriteCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/detail?code=${favorite.location.code}`, { state: { favorite } });
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) return onRemove();
    onAdd();
  };

  return (
    <Card
      className="relative cursor-pointer overflow-hidden transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold">{favorite.nickname || favorite.location.path.replaceAll("-", " ")}</p>
          {favorite.nickname && (
            <p className="text-muted-foreground text-xs">{favorite.location.path.replaceAll("-", " ")}</p>
          )}
          <div className="mt-2 space-y-1">
            <p className="text-2xl font-bold">{weather.currentTemp !== null ? `${weather.currentTemp}°` : "--°"}</p>
            <p className="text-muted-foreground text-sm">
              최저 {weather.todayMinTemp !== null ? `${weather.todayMinTemp}°` : "--°"} / 최고{" "}
              {weather.todayMaxTemp !== null ? `${weather.todayMaxTemp}°` : "--°"}
            </p>
          </div>
        </div>
        <div className="favorite-heart group">
          {isFavorite ? (
            <Heart onClick={handleHeartClick} fill="black" stroke="black" strokeWidth={0} />
          ) : (
            <Heart className="text-white" onClick={handleHeartClick} />
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
