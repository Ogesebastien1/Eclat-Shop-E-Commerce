import React, { useState, useEffect } from "react";
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
import qs from "qs";
import { toast } from "react-toastify";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    try {
      const formData = {
        "reset_password_request_form[email]": email,
      };

      const response = await axios.post(
        "http://localhost:8000/api/reset-password",
        qs.stringify(formData, { encode: false }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      // Store the token in local storage or somewhere else where you can access it later
      localStorage.setItem("email", email);
      toast.success("Email has been sent. Please check your inbox.");
    } catch (error) {
      console.error(error);
      toast.success("Email has been sent. Please check your inbox.");
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
      <Link
        href="/"
        style={{ position: "absolute", top: "1rem", left: "1rem" }}
      >
        ← Back to Home
      </Link>
      <Card className="max-w-[400px]">
        <CardHeader className="center">
          <Lottie animationData={animationData} loop={true} />
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
              marginBottom: "1rem",
              width: "100%",
            }}
            onClick={handleResetPassword}
            className="bg-violet-400"
          >
            Reset Password
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

export default ResetPassword;
