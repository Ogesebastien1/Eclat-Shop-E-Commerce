import React, { useRef, useEffect, useState, useContext } from "react";
import { useTheme } from "../contexts/themeContext";
import Lottie from "lottie-react";
import animationSun from "../animations/Lottie.json";
import animationMoon from "../animations/moon-animation.json";

const animations = {
  light: animationSun,
  dark: animationMoon,
};

const ThemeSwitcher: React.FC = (): JSX.Element => {
  const switcher = useRef<HTMLDivElement | null>(null);
  const switcherButton = useRef<HTMLButtonElement>(null);

  const animations: { [key: string]: any } = {
    light: animationSun,
    dark: animationMoon,
  };

  const { theme, setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState<string>(theme);
  const [animationData, setAnimationData] = useState(animations[theme]);
  let height = "30px";
  let width = "30px";

  const setDarkTheme = () => {
    if (setTheme) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
      setActiveTheme("dark");
      document.body.classList.add("dark");
      setAnimationData(animationMoon);
    }
  };

  const setLightTheme = () => {
    if (setTheme) {
      document.documentElement.classList.remove("dark");
      setTheme("light");
      setActiveTheme("light");
      document.body.classList.remove("dark");
      setAnimationData(animationSun);
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      setDarkTheme();
      height = "30px";
      width = "30px";
    } else {
      setLightTheme();
      height = "60px";
      width = "60px";
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  };

  return (
    <>
      <div
        className="fixed bottom-7 left-5 z-[9999]"
        id="theme-switcher"
        ref={switcher}
      >
        <div className="relative">
          <button
            ref={switcherButton}
            className="w-[40px] h-[40px]"
            type="button"
            id="themeSwitcher"
            aria-expanded="false"
            onClick={toggleTheme}
          >
            <Lottie
              animationData={animationData}
              loop={false}
              key={activeTheme}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default ThemeSwitcher;
