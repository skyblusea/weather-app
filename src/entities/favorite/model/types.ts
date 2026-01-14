type Location = {
  code: string;
  gridX: number;
  gridY: number;
  path: string;
};

export interface Favorite {
  id: string;
  nickname?: string;
  location: Location;
  addedAt: number;
}
