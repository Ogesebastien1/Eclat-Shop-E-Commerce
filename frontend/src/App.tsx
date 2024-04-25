import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ResetPassword } from "./pages/reset-password";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ModifiePassword } from "./pages/modifie-password";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/modify-password" element={<ModifiePassword />} />
      </Routes>
    </div>
  );
}

export default App;
