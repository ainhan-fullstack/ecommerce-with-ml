import { jwtDecode } from "jwt-decode";

interface TokenPayLoad {
  id: number;
  email: string;
  expired: number;
}

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const decode = jwtDecode<TokenPayLoad>(token!);
    const currentTime = Math.floor(Date.now() / 1000);

    return decode.expired > currentTime;
  } catch (err) {
    return false;
  }
};
