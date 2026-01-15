import type { Location } from "@/entities/location/model/@x/favorite";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_FAVORITES } from "../model/constants";
import type { Favorite, FavoritesState } from "../model/types";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      add: (location: Location): { success: boolean; message: string } => {
        const { favorites, isMax } = get();

        if (isMax()) {
          return { success: false, message: "즐겨찾기는 최대 6개까지 등록할 수 있습니다." };
        }

        if (favorites.some((f) => f.id === location.id)) {
          return { success: false, message: "이미 즐겨찾기에 추가되었습니다." };
        }

        const newFavorite: Favorite = {
          id: location.id,
          location,
          nickname: location.name,
          addedAt: Date.now(),
        };

        set({ favorites: [...favorites, newFavorite] });
        return { success: true, message: "즐겨찾기에 추가되었습니다." };
      },

      remove: (id: string) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },

      isFavorite: (id: string): boolean => {
        return get().favorites.some((f) => f.id === id);
      },

      isMax: (): boolean => {
        return get().favorites.length >= MAX_FAVORITES;
      },
    }),
    {
      name: "weather-app-favorites",
    },
  ),
);
