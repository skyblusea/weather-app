import { httpClient } from "@/shared/http";
import type {
  WeatherFcstResponse,
  WeatherNcstResponse,
  WeatherRequestParams,
  WeatherVillageFcstResponse,
} from "../model/types";

const SERVICE_KEY = import.meta.env.VITE_KMA_SERVICE_KEY;
const WEATHER_API_URL = {
  ncst: "/getUltraSrtNcst",
  fcst: "/getUltraSrtFcst",
  villageFcst: "/getVilageFcst",
};

export const getNcst = async (params: WeatherRequestParams) => {
  const response = await httpClient.get<null, WeatherNcstResponse>(WEATHER_API_URL.ncst, {
    params: {
      ServiceKey: SERVICE_KEY,
      pageNo: 1,
      numOfRows: 10,
      dataType: "JSON",
      ...params,
    },
  });
  return response.data.response.body.items.item;
};

export const getFcst = async (params: WeatherRequestParams) => {
  const response = await httpClient.get<null, WeatherFcstResponse>(WEATHER_API_URL.fcst, {
    params: {
      ServiceKey: SERVICE_KEY,
      pageNo: 1,
      numOfRows: 60,
      dataType: "JSON",
      ...params,
    },
  });
  return response.data.response.body.items.item;
};

export const getVillageFcst = async (params: WeatherRequestParams) => {
  const response = await httpClient.get<null, WeatherVillageFcstResponse>(WEATHER_API_URL.villageFcst, {
    params: {
      ServiceKey: SERVICE_KEY,
      pageNo: 1,
      numOfRows: 871,
      dataType: "JSON",
      ...params,
    },
  });
  return response.data.response.body.items.item;
};
