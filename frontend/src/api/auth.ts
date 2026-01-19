import axios from "axios";
import type { IUser, IAuthResponse } from "../interfaces/auth";
import { baseUrl} from "./baseUrl";
import Cookies from "js-cookie";

export const registerUser = async (user: IUser): Promise<IAuthResponse> => {
  const { data } = await axios.post(`${baseUrl}/auth/register`, user, {
    withCredentials: true, // important if you use cookies
  });
  return data;
};

export const loginUser = async (email: string, password: string): Promise<IAuthResponse> => {
  const { data } = await axios.post(`${baseUrl}/auth/login`, { email, password }, {
    withCredentials: true, // important if you use cookies
  });
  return data;
};

// utils/auth.ts

export const isLoggedIn = (): boolean => {
  const token = Cookies.get("token");
  return !!token; // true if token exists, false if not
};

