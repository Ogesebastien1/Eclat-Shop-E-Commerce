import React, { useEffect } from "react";
import { Accordion, AccordionItem, Image, Button, CardFooter, Card } from "@nextui-org/react";
import MyNavbar from "../components/navbar";
import { useLocation } from "react-router-dom";

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

  useEffect(() => {
    console.log(item);
  }, []);

  
  const product = {
    name: "Product Name",
    description: "This is a great product. It has many features and benefits.",
    price: "$99.99",
    image: "https://via.placeholder.com/700x700", // Replace with your product image URL
  };

  return (
    <>  
    <MyNavbar /> 
    <Button className="m-4" onClick={() => window.history.back()}>Back to Shop</Button>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '100px', marginLeft: '250px', marginRight: '20px' }}>
      <div style={{ flex: 1 }}>
        <Accordion variant="splitted">
          <AccordionItem key="1" aria-label="Product Details" title="Product Details">
            {item.description}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Shipping Information" title="Shipping Information">
            "We offer free shipping worldwide. The product will be delivered within 2-3 weeks."
          </AccordionItem>
          <AccordionItem key="3" aria-label="Return Policy" title="Return Policy">
            "We accept returns within 30 days of the purchase date."
          </AccordionItem>
        </Accordion>
      </div>
      <div style={{ flex: 1 }}>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none"
        style={{ width: '90%', height: '420px' }}
      >
        <Image
          alt={item.name}
          className="object-cover w-full h-full"
          src={item.photo}
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/90" style={{ marginLeft: '90px', fontSize: '20px', color: 'white'}}>{item.price} $</p>
          <Button className="text-tiny text-white bg-white/20" variant="flat" color="default" radius="lg" size="sm">
             Add to Cart
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
    </>
  );
}