import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <button
        onClick={async () => {
          try {
            const response = await axios.post(
              "http://localhost:8000/api/reset-password"
            );
            console.log(response.data);

            // Redirect the user to a new page
            navigate("/new-page");
          } catch (error: any) {
            // Handle error...
          }
        }}
      >
        reset password
      </button>
    </div>
  );
}

export default App;
