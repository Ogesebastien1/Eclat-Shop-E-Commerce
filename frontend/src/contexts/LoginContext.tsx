import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface LoginContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
}

export const LoginContext = createContext<LoginContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  token: "",
  setToken: () => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8000/api/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setLoggedIn(true);
        })
        .catch(() => {
          setLoggedIn(false);
        });
    }
  }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setLoggedIn, token, setToken }}>
      {children}
    </LoginContext.Provider>
  );
};
