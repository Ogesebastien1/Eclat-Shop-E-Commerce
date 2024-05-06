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
  const [hoverStates, setHoverStates] = useState(Array(list.length).fill(false));

  const handleMouseEnter = (index: number) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = true;
    setHoverStates(newHoverStates);
  };

  const handleMouseLeave = (index: number) => {
    const newHoverStates = [...hoverStates];
    newHoverStates[index] = false;
    setHoverStates(newHoverStates);
  };
  
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
  
  return (
    <>
      <MyNavbar />
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mx-auto w-11/12">
        {list.map((item, index) => (
          <Card 
            shadow="sm" 
            key={index} 
            isPressable 
            onPress={() => console.log("item pressed")}
            onClick={() => navigate(`/details/${item.id}`, { state: { item } })}
          >
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.name}
                className="w-full object-cover h-[140px]"
                src={item.photo}
              />
            </CardBody>
            <CardFooter className="text-small justify-between">
              <b>{item.name}</b>
              <p className="text-default-500">{item.price} €</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}