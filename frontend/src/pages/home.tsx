import { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Lottie from "lottie-react";
import { useTheme } from "../contexts/themeContext";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import { CSSTransition } from "react-transition-group";
import "./transitions.css";

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  let animationData = theme == "dark" ? darkanimation : lightanimation;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <Lottie animationData={animationData} width={400} height={400} />
      </CSSTransition>

      <CSSTransition
        in={!loading}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <Spline
          scene="https://prod.spline.design/vTMA4rnfHpOsL65Q/scene.splinecode"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </CSSTransition>
    </div>
  );
};
