import React, { useEffect, useState } from "react";
import {
  Card,
  Image,
  CardFooter,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import Lottie from "react-lottie";
import { useTheme } from "../contexts/themeContext";
import MyNavbar from "../components/navbar";
import Cart from "../components/cart";

interface Item {
  photo: string;
  name: string;
  description: string;
  price: string;
  id: string;
}

export function Shop() {
  const [list, setList] = useState<Item[]>([]);
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  let animationData = theme === "dark" ? darkanimation : lightanimation;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    animationData = theme === "dark" ? darkanimation : lightanimation;
  }, [theme]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.data;
        setList(data.products || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // change this
        height: "100vh",
        paddingTop: "1rem",
      }}
    >
      {isloading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      ) : (
        <div>
          <MyNavbar />
          <div
            className="gap-2 grid grid-cols-2 sm:grid-cols-4 mx-auto min-w-max max-w-6xl"
            style={{
              zIndex: 0,
              overflow: "auto",
              marginTop: "5rem",
              marginBottom: "1rem",
            }}
          >
            {list.map((item, index) => (
              <Card
                shadow="sm"
                className="z-0"
                key={index}
                isPressable
                onClick={() =>
                  navigate(`/details/${item.id}`, { state: { item } })
                }
                style={{
                  width: "400px", // Increase the width to make the cards larger
                }}
              >
                <CardBody className="overflow-visible p-0">
                  <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.name}
                    className="w-full-cover h-[200px] object-cover" // Add object-cover here
                    src={item.photo}
                  />
                </CardBody>
                <CardFooter className="text-small justify-between">
                  <b style={{ textTransform: "uppercase" }}>{item.name}</b>
                  <p className="text-default-500">{item.price} €</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Cart />
        </div>
      )}
    </div>
  );
}
