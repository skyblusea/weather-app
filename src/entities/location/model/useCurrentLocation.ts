import type { Location } from "@/entities/location/model/types";
import { latLonToGrid } from "@/shared/lib/latLonToGrid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { locationQueryOptions } from "../api/queries";

const DEFAULT_LOCATION: Location = {
  id: "서울특별시-광진구-광장동",
  nx: 62,
  ny: 126,
  name: "서울특별시 광진구 광장동",
};

export function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<Location>(DEFAULT_LOCATION);

  const { data: kmaLocations } = useQuery(locationQueryOptions.list());
  const getLocationPath = (nx: number, ny: number) => {
    const location = kmaLocations?.find((location) => location.nx === nx && location.ny === ny);
    return location?.path;
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("해당 브라우저는 위치 정보를 지원하지 않습니다");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { x: nx, y: ny } = latLonToGrid(longitude, latitude);
        const locationPath = getLocationPath(nx, ny);

        setCurrentLocation({
          id: locationPath ?? DEFAULT_LOCATION.id,
          name: locationPath?.replaceAll("-", " ") ?? DEFAULT_LOCATION.name,
          nx,
          ny,
        });
      },
      (error) => {
        let errorMessage = "위치 정보를 가져오는데 실패했습니다";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 권한이 거부되었습니다";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 요청 시간이 초과되었습니다";
            break;
        }

        console.error("Geolocation ERROR:", errorMessage);
        setCurrentLocation(DEFAULT_LOCATION);
      },
    );
  }, []);

  return {
    currentLocation,
    setCurrentLocation,
  };
}
