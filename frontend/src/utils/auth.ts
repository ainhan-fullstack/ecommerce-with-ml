import { jwtDecode } from "jwt-decode";
import api from "./axios";
import type { AxiosRequestConfig } from "axios";

interface TokenPayLoad {
  id: number;
  email: string;
  exp: number;
}

let accessToken: string | null = null;

const tokenFromStorage = localStorage.getItem("token");
if (tokenFromStorage) accessToken = tokenFromStorage;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("token", token);
};

export const getAccessToken = () => accessToken;

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const decode = jwtDecode<TokenPayLoad>(token!);
    const currentTime = Math.floor(Date.now() / 1000);

    return decode.exp > currentTime;
  } catch (err) {
    return false;
  }
};

export const fetchWithAuth = async (
  url: string,
  config: AxiosRequestConfig = {}
) => {
  try {
    const res = await api.get(url, {
      ...config,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        ...config.headers,
      },
    });
    return res;
  } catch (err: any) {
    if (err.response?.status === 401) {
      const refreshed = await api.post("/refresh-token");
      setAccessToken(refreshed.data.token);
      const retry = await api.get(url, {
        ...config,
        headers: {
          Authorization: `Bearer ${refreshed.data.token}`,
          ...config.headers,
        },
      });
      return retry;
    } else {
      console.error("Refresh token error", err);
    }
  }
};
