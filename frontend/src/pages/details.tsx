import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Image,
  Button,
  CardFooter,
  Card,
} from "@nextui-org/react";
import MyNavbar from "../components/navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cart from "../components/cart";

interface Item {
  photo: string;
  name: string;
  description: string;
  price: string;
  id: string;
}

interface LocationState {
  item: Item;
}

export default function Details() {
  const location = useLocation();
  const { item } = location.state as LocationState;
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      var parentElement = imageRef.current.parentNode as HTMLElement;
      if (parentElement) {
        parentElement.style.width = "100%";
        parentElement.style.height = "100%";
      }
    }
  }, []);

  const addToCart = (productId: any, productName: string, event: any) => {
    axios
      .post(`http://localhost:8000/api/carts/${productId}`, null, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        toast.success(`${productName} added to cart!`);
      })
      .catch((error) => {
        toast.error(`There was an error adding ${productName} to the cart.`);
        console.error("There was an error!", error);
      });
  };

  return (
    <>
      <MyNavbar />
      <Button onClick={() => window.history.back()}>Back to Shop</Button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "2rem",
          }}
        >
          <div style={{ flex: 1, width: "100%" }}>
            <Accordion variant="splitted" className="w-full pt-5">
              <AccordionItem
                key="1"
                aria-label="Product Details"
                title="Product Details"
                className="break-words"
              >
                {item.description}
              </AccordionItem>
              <AccordionItem
                key="2"
                aria-label="Shipping Information"
                title="Shipping Information"
                className="break-words"
              >
                "We offer free shipping worldwide. The product will be delivered
                within 2-3 weeks."
              </AccordionItem>
              <AccordionItem
                key="3"
                aria-label="Return Policy"
                title="Return Policy"
                className="break-words"
              >
                "We accept returns within 30 days of the purchase date."
              </AccordionItem>
            </Accordion>
          </div>
          <div style={{ flex: 1 }} className="w-full pr-5">
            <Card
              isFooterBlurred
              radius="lg"
              className="border-none m-4"
              style={{ width: "100%", minHeight: "100px", height: "auto" }}
            >
              <Image
                ref={imageRef}
                alt={item.name}
                className="object-cover w-full h-full imgpersonalized"
                src={item.photo}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p
                  className="text-tiny text-white/90"
                  style={{
                    marginLeft: "90px",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  {item.price} €
                </p>
                <Button
                  className="text-tiny text-white bg-white/20"
                  variant="flat"
                  color="default"
                  radius="lg"
                  size="sm"
                  onClick={(event) =>
                    addToCart(Number(item.id), item.name, event)
                  }
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
