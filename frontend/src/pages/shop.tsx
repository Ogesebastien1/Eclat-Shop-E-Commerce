import React, { useEffect, useState } from "react";
import {Card, Image, CardFooter, CardBody, CardHeader} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import Lottie from 'react-lottie';
import { useTheme } from "../contexts/themeContext";
import MyNavbar from "../components/navbar";

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
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    animationData = theme === "dark" ? darkanimation : lightanimation;
    console.log("theme", theme);
  }, [theme]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.data;
        setList(data.products || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchProducts();
  }, []);
  
  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
    >
        {isloading ? (
          <Lottie options={defaultOptions} height={400} width={400} />
        ) : (
          <div>
             <MyNavbar />
             <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 mx-auto min-w-max max-w-6xl" style={{ marginTop: '-250px' }}>
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
              className="w-full-cover h-[200px]"
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
        </div>
      )}
     </div>
  );
}