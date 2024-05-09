import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface LoginContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  userData: string;
  setUserData: (userData: string) => void;
  isLoadingUser: boolean; // Ajoutez cette ligne
  setIsLoadingUser: (isLoadingUser: boolean) => void; // Ajoutez cette ligne
}

export const LoginContext = createContext<LoginContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  token: "",
  setToken: () => {},
  userData: "",
  setUserData: () => {},
  isLoadingUser: true, // Ajoutez cette ligne
  setIsLoadingUser: () => {}, // Ajoutez cette ligne
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Ajoutez cette ligne

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
          setIsLoadingUser(false); // Ajoutez cette ligne
        })
        .catch(() => {
          setLoggedIn(false);
          localStorage.removeItem("token");
          setIsLoadingUser(false); // Ajoutez cette ligne
        });
    } else {
      setIsLoadingUser(false); // Ajoutez cette ligne
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        setLoggedIn,
        token,
        setToken,
        userData,
        setUserData,
        isLoadingUser,
        setIsLoadingUser,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
