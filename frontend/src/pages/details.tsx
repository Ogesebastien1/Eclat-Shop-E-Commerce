import React from "react";
import { Accordion, AccordionItem, Image, Button, CardFooter, Card } from "@nextui-org/react";
import MyNavbar from "../components/navbar";

export default function Details() {
  const product = {
    name: "Product Name",
    description: "This is a great product. It has many features and benefits.",
    price: "$99.99",
    image: "https://via.placeholder.com/700x700", // Replace with your product image URL
  };

  return (
    <>  
    <MyNavbar /> 
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '100px', marginLeft: '250px', marginRight: '20px' }}>
      <div style={{ flex: 1 }}>
        <Accordion variant="splitted">
          <AccordionItem key="1" aria-label="Product Details" title="Product Details">
            {product.description}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Shipping Information" title="Shipping Information">
            {/* Replace with your shipping information */}
            "We offer free shipping worldwide. The product will be delivered within 2-3 weeks."
          </AccordionItem>
          <AccordionItem key="3" aria-label="Return Policy" title="Return Policy">
            {/* Replace with your return policy */}
            "We accept returns within 30 days of the purchase date."
          </AccordionItem>
        </Accordion>
      </div>
      <div style={{ flex: 1 }}>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none"
        style={{ width: '70%', height: 'auto' }} // Adjust the size of the card here
      >
        <Image
          alt={product.name}
          className="object-cover w-full h-full" // This will make the image take up the entire card
          src={product.image}
        />
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-black/90" style={{ marginLeft: '90px' }}>{product.price}</p>
          <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
             Add to Cart
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
    </>
  );
}