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
import animationData from "../animations/payment-success-animation.json";

export const Success = () => {
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
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            Payment successful
          </h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <Lottie animationData={animationData} width={400} height={400} />
        </CardBody>
        <Divider />
        <CardFooter className="center">
          <Link href="/shop" className="w-full">
            <Button className="bg-sky-400 w-full">Continue shopping</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Success;
