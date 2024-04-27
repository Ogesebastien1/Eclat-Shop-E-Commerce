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
import animationData from "../assets/register-animation.json";

export const Register = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  const handleRegister = async () => {
    try {
      const formData = {
        login: login,
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password,
      };

      const response = await axios.post(
        `http://localhost:8000/api/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      window.location.href = "/login";
    } catch (error: any) {
      if (error.response.status === 403) {
        alert(error.response.data);
        console.error(error);
      } else {
        console.error(error);
      }
    }
  };

  // Mettre à jour l'état isFormValid chaque fois que l'état des champs change
  useEffect(() => {
    if (login && email && firstname && lastname && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [login, email, firstname, lastname, password]);

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
          <div
            className="bg-zinc-100"
            style={{ borderRadius: 6, width: "100%", padding: "1rem" }}
          >
            <h1>Register</h1>
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
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
          </div>
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
            onClick={handleRegister}
            disabled={!isFormValid}
            className="bg-sky-400"
          >
            Register now !
          </Button>

          <Link
            href="/login"
            className="center"
            style={{
              marginBottom: "1rem",
            }}
          >
            Already an account? Back to login
          </Link>
        </CardFooter>
        <Divider />
      </Card>
    </div>
  );
};

export default Register;
