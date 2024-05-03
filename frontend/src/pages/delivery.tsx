import React, { useState, useEffect } from "react";
import {
  CardHeader,
  Card,
  CardBody,
  CardFooter,
  Button,
  Divider,
  RadioGroup,
  cn,
  Radio,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import animationData from "../animations/delivery-animation.json";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse w-full cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

function DeliveryPage() {
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(0); // New state for delivery price
  const location = useLocation(); // Get the current location
  const commandId = new URLSearchParams(location.search)
    .get("command")
    .replace(/[{}]/g, "");
  console.log("Command ID:", commandId); // Log the command ID

  useEffect(() => {
    if (commandId) {
      // Fetch the command when the component mounts
      axios
        .get(`http://localhost:8000/api/payment/${commandId}`)
        .then((response) => {
          // Set the initial delivery price from the fetched command
          setDeliveryPrice(response.data.deliveryPrice);
        });
    }
  }, [commandId]);

  const handleDeliverySelection = (delivery: string, price: number) => {
    setSelectedDelivery(delivery);
    setDeliveryPrice(price);

    // Update the command with the new delivery price
    axios.put(`http://localhost:8000/api/payment/${commandId}`, {
      deliveryPrice: price,
    });
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
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            DELIVERY
          </h1>
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ margin: "1rem" }}
          />
        </CardHeader>
        <Divider />
        <CardBody className="justify-center items-center">
          <RadioGroup
            value={selectedDelivery}
            onChange={(event) =>
              handleDeliverySelection(
                event.target.value,
                event.target.value === "standard" ? 500 : 1000
              )
            }
          >
            <CustomRadio
              value="standard"
              description="Livraison en 3-5 jours ouvrables"
            >
              Livraison standard - 5€
            </CustomRadio>
            <CustomRadio
              value="express"
              description="Livraison le jour ouvrable suivant"
            >
              Livraison express - 10€
            </CustomRadio>
          </RadioGroup>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link
            style={{
              margin: "0.5rem",
              width: "100%",
            }}
            to={{
              pathname: "/payment/" + commandId,
            }}
          >
            <Button
              style={{
                width: "100%",
              }}
              className={`bg-gradient-to-r from-blue-600 to-pink-600 w-full`}
              disabled={!selectedDelivery}
            >
              Go to Payment
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DeliveryPage;
