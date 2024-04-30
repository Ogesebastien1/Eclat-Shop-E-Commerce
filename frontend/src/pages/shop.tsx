import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Card, Image, CardFooter, CardBody} from "@nextui-org/react";

export function Shop() {
  const list = [
    {
      title: "Orange",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Oranges_-_whole-halved-segment.jpg/1200px-Oranges_-_whole-halved-segment.jpg",
      price: "$5.50",
      description: "Test description"
    },
    {
      title: "Tangerine",
      img: "https://as1.ftcdn.net/v2/jpg/00/29/69/78/1000_F_29697857_Rh1QHZRduOv5u8KclCX0cGTPpkVPbtFt.jpg",
      price: "$3.00",
      description: "Test description"
    },
    {
      title: "Raspberry",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Raspberry_-_whole_%28Rubus_idaeus%29.jpg/1200px-Raspberry_-_whole_%28Rubus_idaeus%29.jpg",
      price: "$10.00",
      description: "Test description"
    },
    {
      title: "Lemon",
      img: "https://media.istockphoto.com/id/1389128157/fr/photo/fruit-citronn%C3%A9-avec-feuille-isol%C3%A9e-citron-entier-et-demi-avec-des-feuilles-sur-fond-blanc.jpg?s=612x612&w=0&k=20&c=Ilhfen4bwWI5Xfp7A9EoxcEZ7jm_kjsTlI9eL-y-AzI=",
      price: "$5.30",
      description: "Test description"
    },
    {
      title: "Avocado",
      img: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/avocados-title-c32b587.jpg?quality=90&resize=556,505",
      price: "$15.70",
      description: "Test description"
    },
    {
      title: "Lemon 2",
      img: "https://static.toiimg.com/thumb/msid-103846641,width-1280,height-720,resizemode-4/103846641.jpg",
      price: "$8.00",
      description: "Test description"
    },
    {
      title: "Banana",
      img: "https://paniersduprimeur.fr/wp-content/uploads/2021/04/banane.png",
      price: "$7.50",
      description: "Test description"
    },
    {
      title: "Watermelon",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Watermelons.jpg/800px-Watermelons.jpg",
      price: "$12.20",
      description: "Test description"
    },
  ];

  return (
    <>
      <div>
        <Navbar>
          <NavbarBrand>
            <p className="font-bold text-inherit">ECLAT SHOP</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link color="foreground" href="#">
                Contact
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link href="#" aria-current="page">
                Shopping cart
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link color="foreground" href="#">
                About us
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </div>

    <div className="flex items-center justify-center min-h-screen">
      <div className="gap-4 grid grid-cols-2 sm:grid-cols-4 mx-auto">
        {list.map((item, index) => (
          <Card
          isFooterBlurred
          radius="lg"
          className="border-none"
        >
          <Image
            alt="Woman listing to music"
            className="object-cover"
            height={200}
            src="/images/hero-card.jpeg"
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">Price $</p>
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
              Show more
            </Button>
          </CardFooter>
        </Card>
        ))}
      </div>
    </div>
  </>

  );
}