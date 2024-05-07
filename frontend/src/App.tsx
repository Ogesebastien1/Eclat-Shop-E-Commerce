import "./App.css";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ResetPassword } from "./pages/reset-password";
import { ModifiePassword } from "./pages/modifie-password";
import { Shop } from "./pages/shop";
import { Success } from "./pages/success";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import ThemeSwitcher from "./components/themeswitcher";
import { ThemeProvider, useTheme } from "./contexts/themeContext";
import Details from "./pages/details";
import Payment from "./pages/payment";
import Contact from "./pages/contact";
import DeliveryPage from "./pages/delivery";
import Spline from "@splinetool/react-spline";
import { useLocation } from "react-router-dom";

function App() {
  const { theme } = useTheme();
  const themeClass = theme === "dark" ? "dark" : "light";
  const location = useLocation();

  return (
    <NextUIProvider>
      <ThemeSwitcher />
      <main className={`${themeClass} text-foreground bg-background relative`}>
        {location.pathname !== "/" && (
          <Spline
            scene="https://prod.spline.design/Vr2Pm5sxZFITlfcj/scene.splinecode"
            className="absolute inset-0 z-0"
          />
        )}
        <div className="App relative z-10">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/modify-password" element={<ModifiePassword />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/details" element={<Details />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </div>
      </main>
    </NextUIProvider>
  );
}

export default App;
