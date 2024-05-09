import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

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
  setLoggedIn: () => { },
  token: "",
  setToken: () => { },
  userData: null,
  setUserData: () => { },
  isLoadingUser: true,
  setIsLoadingUser: () => { },
});

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        const response = await axios.get("http://localhost:8000/api/user", {
          headers: {
            Authorization: token,
          },
        });
        setUserData(response.data);
        setLoggedIn(true)
      } catch (error) {
        console.error(error);
      }
      setLoggedIn(true)
      setIsLoadingUser(false);
    };

    if (token) {
      fetchUser();
    } else if (sessionStorage.getItem("token")) {
      setToken(sessionStorage.getItem("token") as string);
    } else if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token") as string);
    }
  }, [token]);

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