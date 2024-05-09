import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  roles: string[];
  email: string;
  login: string;
  avatar: string;
}

interface LoginContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  userData: User | null;
  setUserData: (userData: User | null) => void;
  isLoadingUser: boolean;
  setIsLoadingUser: (isLoadingUser: boolean) => void;
}

export const LoginContext = createContext<LoginContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  token: "",
  setToken: () => {},
  userData: null, // Initialisez userData avec null
  setUserData: () => {},
  isLoadingUser: true,
  setIsLoadingUser: () => {},
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<User | null>(null); // Utilisez le type User pour userData
  const [isLoadingUser, setIsLoadingUser] = useState(true);

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
