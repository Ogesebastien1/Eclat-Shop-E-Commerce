import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ResetPassword } from "./pages/reset-password";
import { ModifiePassword } from "./pages/modifie-password";
import { Shop } from "./pages/shop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import ThemeSwitcher from "./components/themeswitcher";
import { ThemeProvider, useTheme } from "./contexts/themeContext";

function App() {
  const { theme } = useTheme();
  const themeClass = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    console.log("Theme changed to", theme);
  }, [theme]);

  return (
    <NextUIProvider>
      <ThemeSwitcher />
      <main className={`${themeClass} text-foreground bg-background`}>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/modify-password" element={<ModifiePassword />} />
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </div>
      </main>
    </NextUIProvider>
  );
}

export default App;
