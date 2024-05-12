import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Input,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import animationData from "../animations/password-animation.json";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";

export const ModifiePassword = () => {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    setToken(token);
  }, []);

  const handleResetPassword = async () => {
    // Check if the passwords match
    if (password1 !== password2) {
      alert("The passwords do not match.");
      return;
    }

    const email = localStorage.getItem("email");

    try {
      const formData = {
        plainPassword: password1,
        token: token,
        email: email,
      };

      const response = await axios.post(
        `http://localhost:8000/api/reset-password/reset`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          content: formData,
        }
      );
      localStorage.removeItem("email");
      window.location.href = "/login";
      toast.success("Email has been sent. Please check your inbox.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

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
        <CardHeader className="center">
          <Lottie animationData={animationData} loop={true} />
        </CardHeader>
        <Divider />
        <CardBody>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Input
              label="New Password"
              placeholder="Enter your new password"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
          </div>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
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
            color="success"
            style={{
              marginBottom: "1rem",
            }}
            onClick={handleResetPassword}
          >
            Modifie Password
          </Button>
          <Link
            href="/login"
            className="center"
            style={{
              marginBottom: "1rem",
            }}
          >
            Back to login
          </Link>
        </CardFooter>
        <Divider />
      </Card>
    </div>
  );
};

export default ModifiePassword;
