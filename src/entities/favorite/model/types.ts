import type { Location } from "@/entities/location/model/@x/favorite";

export interface Favorite {
  id: string;
  nickname?: string;
  location: Location;
  addedAt: number;
}

export interface FavoritesState {
  favorites: Favorite[];
  add: (location: Location, nickname?: string) => { success: boolean; message: string };
  remove: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isMax: () => boolean;
  getFavorite: (id: string) => Favorite | undefined;
  getNickname: (id: string) => string | undefined;
  updateNickname: (id: string, nickname: string) => void;
}
