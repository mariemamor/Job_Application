import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getTokenCookie, removeTokenCookie } from "../api/cookies";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "business" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getTokenCookie(); // get token from cookie
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:4000/api/auth/getUserByToken", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    removeTokenCookie(); // remove cookie
    setUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, setUser, logout } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
