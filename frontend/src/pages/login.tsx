import React, { useState, useEffect } from "react";
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
} from "@nextui-org/react";
import Lottie from "lottie-react";
import animationData from "../animations/login-animation.json";
import { toast } from "react-toastify";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleLoginr = async () => {
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
      localStorage.setItem("token", response.data.token);
      setIsLoading(false);
      window.location.href = "/shop";
    } catch (error: any) {
      if (error.response.status === 401) {
        toast.error(error.response.data);
        console.error(error);
        setIsLoading(false);
      } else {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

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
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "0.1rem" }}>
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
            onClick={handleLoginr}
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
