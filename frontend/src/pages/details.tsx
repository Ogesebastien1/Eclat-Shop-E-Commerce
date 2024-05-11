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
        toast.success(`${productName.toUpperCase()} added to cart!`);
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
          height: "95vh",
          padding: "20px",
        }}
      >
       <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '70%' }}>
          <div style={{ flex: 1, maxWidth: '50%', overflow: 'auto' }}>
            <Accordion variant="splitted">
              <AccordionItem
                key="1"
                title="Product Details"
              >
                {item.description}
              </AccordionItem>
              <AccordionItem
                key="2"
                title="Shipping Information"
              >
                "We offer free shipping worldwide. The product will be delivered
                within 2-3 weeks."
              </AccordionItem>
              <AccordionItem
                key="3"
                title="Return Policy"
              >
                "We accept returns within 30 days of the purchase date."
              </AccordionItem>
            </Accordion>
          </div>
          <div style={{ flex: 1, maxWidth: '50%' }}>
          <Card
            isFooterBlurred
            radius="lg"
            style={{
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              overflow: 'hidden',
              width: '100%', 
              height: '80%', 
              position: 'relative' 
            }}
            >
            <Image
              src={item.photo}
              style={{
                maxWidth: '100%', 
                maxHeight: '100%', 
              }}
            />
            <CardFooter
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px',    
                borderRadius: '10px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                marginLeft: '1px',
                zIndex: 10,
              }}
            >
              <p style={{ textTransform: 'uppercase', fontWeight: 'bold'}}>{item.name}</p>
              <p style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>{item.price} €</p>
              <Button
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}
                onClick={async (event) => {
                  await addToCart(Number(item.id), item.name, event);
                  setTimeout(() => window.location.reload(), 500); 
                }}
              >
                Add to card
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