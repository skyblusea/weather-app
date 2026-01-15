import type { Location } from "@/entities/location/model/types";
import { cn } from "@/shared/lib/utils";
import { Heart } from "lucide-react";
import { useFavoriteToggle } from "../model/useFavoriteToggle";

interface FavoriteButtonProps {
  location: Location;
  color?: "black" | "white";
  className?: string;
  disabled?: boolean;
}

export function FavoriteButton({ location, className, color = "black", disabled = false }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavoriteToggle(location);

  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className={cn("p-0", className, disabled && "invisible opacity-0")}
    >
      {isFavorite ? (
        <Heart fill={color} stroke={color} strokeWidth={0} />
      ) : (
        <Heart className={cn("text-white", color === "black" ? "text-black" : "text-white")} />
      )}
    </button>
  );
}
