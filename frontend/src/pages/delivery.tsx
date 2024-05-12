import React, { useState, useEffect, useContext } from "react";
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
  Spinner,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import animation from "../animations/delivery-animation.json";
import { Link } from "react-router-dom";
import { Link as NextLink } from "@nextui-org/react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTheme } from "../contexts/themeContext";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import { LoginContext } from "../contexts/LoginContext";
import { m } from "framer-motion";
import { set } from "animejs";

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0); // New state for delivery price
  const location = useLocation(); // Get the current location
  const { token } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const command = new URLSearchParams(location.search).get("command");
  const commandId = command ? command.replace(/[{}]/g, "") : "";
  const { theme } = useTheme();
  let animationData = theme == "dark" ? darkanimation : lightanimation;
  interface Item {
    product: string;
    quantity: number;
    price?: number;
    description?: string;
    id?: number;
    photo?: string;
  }

  interface PaymentDetails {
    productList: Item[];
    productPrices: number[];
    productQuantities?: number[];
  }

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    productList: [],
    productPrices: [],
  });

  useEffect(() => {
    if (commandId) {
      // Fetch the command when the component mounts
      axios
        .get(`http://localhost:8000/api/orders/${commandId}`)
        .then((response) => {
          // Set the initial delivery price from the fetched command
          setDeliveryPrice(response.data.totalPrice);
          // Set the payment details
          setPaymentDetails({
            productList: response.data.item.map((item: any) => item.product),
            productPrices: response.data.item.map((item: any) => item.price),
          });
          // Set isDataLoaded to true after the data has been set
          setIsDataLoaded(true);
        });
    }
  }, [commandId]);

  const handleDeliverySelection = (delivery: string, price: number) => {
    // Only run the PUT request if the data has been loaded
    if (isDataLoaded) {
      setIsLoading(true);
      setSelectedDelivery(delivery);
      setDeliveryPrice(price);
      setIsLoading(false);
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
      {!isDataLoaded ? (
        <Lottie animationData={animationData} loop={true} />
      ) : (
        <>
          <NextLink
            href="/shop"
            style={{ position: "absolute", top: "1rem", left: "1rem" }}
          >
            ← Back to shop
          </NextLink>
          <Card className="max-w-[400px]">
            <CardHeader className="center flex-col">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
                DELIVERY
              </h1>
              <Lottie
                animationData={animation}
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
                    event.target.value === "standard" ? 5 : 10
                  )
                }
              >
                <CustomRadio
                  value="Delivery standard"
                  description="Livraison en 3-5 jours ouvrables"
                >
                  Livraison standard - 5€
                </CustomRadio>
                <CustomRadio
                  value="Delivery express"
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
                  pathname: "/payment",
                  search: btoa(
                    "?command=" +
                      encodeURIComponent(commandId) +
                      "&delivery=" +
                      encodeURIComponent(selectedDelivery) +
                      "&price=" +
                      encodeURIComponent(deliveryPrice)
                  ),
                }}
              >
                <Button
                  style={{
                    width: "100%",
                  }}
                  className={`bg-gradient-to-r from-blue-600 to-pink-600 w-full text-white`}
                  disabled={!selectedDelivery || isLoading}
                >
                  {isLoading ? <Spinner color="white" /> : "Go to Payment"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

export default DeliveryPage;
