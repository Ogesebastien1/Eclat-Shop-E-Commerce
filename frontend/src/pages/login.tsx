import { useState, useEffect, ChangeEvent, useContext } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
  Link,
  Spinner,
  Checkbox,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import animationData from "../animations/login-animation.json";
import { toast } from "react-toastify";
import { LoginContext } from "../contexts/LoginContext";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    token,
    setToken,
    isLoggedIn,
    setLoggedIn,
    setUserData,
    isLoadingUser,
    userData,
  } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = {
        login: login,
        password: password,
      };

      const response = await axios.post(
        `http://localhost:8000/api/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (rememberMe) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setLoggedIn(true);
      } else {
        sessionStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setLoggedIn(true);
      }

      // Récupérer les données de l'utilisateur après la connexion réussie
      const userResponse = await axios.get("http://localhost:8000/api/user", {
        headers: {
          Authorization: response.data.token,
        },
      });
      setUserData(userResponse.data);
      setIsLoading(false);
      setLoggedIn(true);
      navigate("/shop");
    } catch (error: any) {
      if (error.response.status === 401) {
        setLoggedIn(false);
        toast.error(error.response.data);
        console.error(error);
        setIsLoading(false);
      } else {
        setLoggedIn(false);
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isLoadingUser) {
      navigate("/shop");
    }
  }, [isLoggedIn, isLoadingUser]);

  // Mettre à jour l'état isFormValid chaque fois que l'état des champs change
  useEffect(() => {
    if (login && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [login, password]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Link
        href="/"
        style={{ position: "absolute", top: "1rem", left: "1rem" }}
      >
        ← Back to Home
      </Link>
      <Card className="max-w-[400px]">
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            LOGIN
          </h1>
          <Lottie animationData={animationData} loop={true} />
        </CardHeader>
        <Divider />
        <CardBody>
          <div style={{ marginBottom: "0.5rem" }}>
            <Input
              label="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "0.5rem", marginLeft: "0.5rem" }}>
            <Checkbox
              checked={rememberMe}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setRememberMe(event.target.checked)
              }
            >
              <div className="text-xs bg-gradient-to-r from-blue-600 to-pink-600 text-transparent bg-clip-text">
                Remember me
              </div>
            </Checkbox>
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
          </div>
          <Link
            href="/reset-password"
            className="center"
            style={{
              marginBottom: "1rem",
              fontSize: "0.8rem",
              marginLeft: "0.5rem",
            }}
          >
            Forgot your password? Reset it now !
          </Link>
        </CardBody>
        <Divider />
        <CardFooter
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              margin: "1rem",
              width: "100%",
            }}
            className="bg-sky-400"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" /> : "Login !"}
          </Button>

          <Link
            href="/register"
            className="center"
            style={{
              marginBottom: "1rem",
            }}
          >
            Don't have an account? Register now !
          </Link>
        </CardFooter>
        <Divider />
      </Card>
    </div>
  );
};

export default Login;
