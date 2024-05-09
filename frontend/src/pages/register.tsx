import React, { useState, useEffect, useContext } from "react";
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
import animationData from "../animations/register-animation.json";
import { toast } from "react-toastify";
import { Tooltip } from "@nextui-org/react";
import PasswordStrengthBar from "react-password-strength-bar";
import { LoginContext } from "../contexts/LoginContext";

export const Register = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordError2, setPasswordError2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { token, setToken, isLoggedIn, setLoggedIn, isLoadingUser } =
    useContext(LoginContext);

  const handleRegister = async () => {
    if (!isFormValid) {
      if (!passwordRegex.test(password)) {
        toast.error(
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
        );
      }
      toast.error("Please fill in all fields correctly.");
      return;
    }
    try {
      setIsLoading(true);
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
      toast.success("Account created successfully. Please log in.");
      setIsLoading(false); // Fin de la requête
    } catch (error: any) {
      if (error.response.status === 403) {
        toast.error(error.response.data);
        setIsLoading(false);
        console.error(error);
      } else {
        console.error(error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isLoadingUser) {
      window.location.href = "/shop";
    }
  }, [isLoggedIn, isLoadingUser]);

  // Mettre à jour l'état isFormValid chaque fois que l'état des champs change
  useEffect(() => {
    if (login && email && firstname && lastname && password && password2) {
      if (passwordRegex.test(password) && password === password2) {
        setIsFormValid(true);
        setPasswordError2("");
      }
    } else {
      setIsFormValid(false);
    }
  }, [login, email, firstname, lastname, password, password2]);

  useEffect(() => {
    if (password !== password2) {
      setPasswordError2(
        "Password does not match. Please enter the same password."
      );
    } else {
      setPasswordError2("");
    }
  }, [password, password2]);

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
      <Card className="w-96">
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            REGISTER
          </h1>
          <div className="w-48 h-48">
            <Lottie animationData={animationData} loop={true} />
          </div>
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
          <div style={{ marginBottom: "0.5rem" }}>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <PasswordStrengthBar password={password} />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <Input
              label="Password"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              isRequired
            />
            {passwordError2 && (
              <Tooltip placement="bottom-start">
                <p style={{ color: "red", fontSize: "0.8rem" }}>
                  {passwordError2}
                </p>
              </Tooltip>
            )}
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
            className="bg-sky-400"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" /> : "Register now !"}
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
