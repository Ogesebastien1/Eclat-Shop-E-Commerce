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
import animationData from "./password-animation.json";
import { Button } from "@nextui-org/react";
import qs from "qs";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");

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

      // Check if the response was successful
      if (response.data.success_code === 200) {
        // Get the token from the response
        const token = response.data.token;

        // Store the token in local storage or somewhere else where you can access it later
        localStorage.setItem("resetToken", token);
        localStorage.setItem("email", email);

        console.log("redirection");

        // Redirect to the password change page
        window.location.href = "/modify-password";
      }
    } catch (error) {
      console.error(error);
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
            color="success"
            style={{
              marginBottom: "1rem",
            }}
            onClick={handleResetPassword}
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
