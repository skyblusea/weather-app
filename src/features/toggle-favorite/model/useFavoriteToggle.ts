import { useFavoritesStore } from "@/entities/favorite/lib/store";
import type { Location } from "@/entities/location/model/types";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

export const useFavoriteToggle = (location: Location) => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const add = useFavoritesStore((state) => state.add);
  const remove = useFavoritesStore((state) => state.remove);

  const isFavorite = useMemo(() => favorites.some((f) => f.id === location.id), [favorites, location.id]);

  const toggle = useCallback(() => {
    if (isFavorite) {
      remove(location.id);
      toast.success("즐겨찾기에서 제거되었습니다.");
    } else {
      const { success, message } = add(location);
      if (success) return toast.success(message);
      toast.error(message);
    }
  }, [isFavorite, location, add, remove]);

  return {
    isFavorite,
    toggle,
  };
};
