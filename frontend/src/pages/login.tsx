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
} from "@nextui-org/react";
import Lottie from "lottie-react";
import animationData from "../assets/login-animation.json";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  const handleLoginr = async () => {
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
      window.location.href = "/home";
    } catch (error: any) {
      if (error.response.status === 401) {
        alert(error.response.data);
        console.error(error);
      } else {
        console.error(error);
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
      <Card className="max-w-[400px]">
        <CardHeader className="center flex-col">
          <div
            className="bg-zinc-100"
            style={{ borderRadius: 6, width: "100%", padding: "1rem" }}
          >
            <h1>Login</h1>
          </div>
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
            disabled={!isFormValid}
          >
            Login !
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
