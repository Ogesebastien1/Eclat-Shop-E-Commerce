import {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

type ThemeContextType = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.theme || "light");

  useEffect(() => {
    const themeChangeHandler = () => {
      const newTheme = localStorage.theme || "light";
      setTheme(newTheme);
      localStorage.theme = newTheme;
    };

    window.addEventListener("storage", themeChangeHandler);

    return () => {
      window.removeEventListener("storage", themeChangeHandler);
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: (value: SetStateAction<string>) => {
          localStorage.theme = value;
          setTheme(value);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
