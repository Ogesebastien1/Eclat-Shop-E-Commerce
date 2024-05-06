import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface LoginContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  userData: string;
  setUserData: (userData: string) => void;
}

export const LoginContext = createContext<LoginContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  token: "",
  setToken: () => {},
  userData: "",
  setUserData: () => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/api/user", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setToken(token);
          setLoggedIn(true);
          setUserData(response.data);
        })
        .catch(() => {
          setLoggedIn(false);
          localStorage.removeItem("token");
        });
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/user", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setToken(token);
          setLoggedIn(true);
          setUserData(response.data);
        })
        .catch(() => {
          setLoggedIn(false);
          localStorage.removeItem("token");
        });
    }
  }, [token, isLoggedIn]);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        token,
        setToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
