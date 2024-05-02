import React, { useEffect, useState } from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Card, Image, CardFooter, CardBody} from "@nextui-org/react";
import { Link as RouterLink } from 'react-router-dom';
import MyNavbar from "../components/navbar";
import { useNavigate } from 'react-router-dom';

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
  
  useEffect(() => {
      fetch('http://localhost:8000/api/products', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setList(data.products || []); 
        })
        .catch(error => console.error('Error:', error));
    }, []);

    const items = list.map((item: Item) => (
      <Card
    isFooterBlurred
    radius="lg"
    className="border-none"
  >
    <Image
      alt={item.name}
      className="object-cover"
      height={200}
      src={item.photo}
      width={200}
    />
    <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
      <p className="text-tiny text-white/80">Price {item.price}</p>
        <Button 
            className="text-tiny text-white bg-black/20" 
            variant="flat" 
            color="default" 
            radius="lg" 
            size="sm"
            onClick={() => navigate(`/details/${item.id}`, { state: { item } })}
          >
            Go to details
          </Button>
    </CardFooter>
  </Card>
));

  return (
    <>
    <MyNavbar />
    <div className="flex items-center justify-center min-h-screen">
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 mx-auto">
        {items}
      </div>
    </div>
  </>
  );
}