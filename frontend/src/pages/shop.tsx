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

  //  const items = list.map((item: Item, index: number) => (
  //   <Card
  //     isFooterBlurred
  //     radius="lg"
  //     className="border-none"
  //   >
  //     <Image
  //       alt={item.name}
  //       className="object-cover"
  //       height={200}
  //       src={item.photo}
  //       width={200}
  //     />
  //     <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
  //       <p className="text-tiny text-white/80">{item.price} $</p>
  //       <Button 
  //         className="text-tiny text-white bg-black/20" 
  //         variant="flat" 
  //         color="default" 
  //         radius="lg" 
  //         size="sm"
  //         onClick={() => navigate(`/details/${item.id}`, { state: { item } })}
  //         onMouseEnter={() => handleMouseEnter(index)}
  //         onMouseLeave={() => handleMouseLeave(index)}
  //         style={hoverStates[index] ? { backgroundColor: '#0067dd' } : {}}
  //       >
  //         Go to details
  //       </Button>
  //     </CardFooter>
  //   </Card>
  // ));
  
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