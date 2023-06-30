import React, { createContext, useCallback, useContext, useState } from "react";
import useAxios from "./useAxios";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { SignUp } from "../types/sign-up.type";
const AuthContext = createContext<{
  loginState: "loggedIn" | "loggedOut";
  setLoginState: React.Dispatch<React.SetStateAction<"loggedIn" | "loggedOut">>;
}>({ loginState: "loggedOut", setLoginState: () => null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loginState, setLoginState] = useState<"loggedIn" | "loggedOut">(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ iat: number; exp: number }>(token);
      if (moment.unix(decodedToken.exp).isAfter(moment())) {
        return "loggedIn";
      } else {
        localStorage.removeItem("token");
      }
    }

    return "loggedOut";
  });
  return (
    <AuthContext.Provider value={{ loginState, setLoginState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuthentication() {
  const { loginState, setLoginState } = useContext(AuthContext);
  const axios = useAxios();

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const { data } = await axios.post<{ access: string }>("/api/token", {
          username,
          password,
        });
        setLoginState("loggedIn");
        localStorage.setItem("token", data.access);
      } catch (error) {
        throw error;
      }
    },
    [axios, setLoginState]
  );
  const signup = useCallback(
    async (data: SignUp) => {
      try {
        await axios.post<{ access: string }>("/api/users/", data);
      } catch (error) {
        throw error;
      }
    },
    [axios]
  );
  const logout = useCallback(() => {
    setLoginState("loggedOut");
    localStorage.removeItem("token");
  }, [setLoginState]);
  return { loginState, setLoginState, login, logout, signup };
}
