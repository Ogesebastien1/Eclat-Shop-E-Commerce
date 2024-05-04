// Navbar.tsx
import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';


const MyNavbar = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <div>
    <Navbar>
    <NavbarBrand>
          <p 
            className="font-bold text-inherit" 
            onClick={() => navigate('/')}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={hover ? { color: '#0067dd', cursor: 'pointer' } : {}}
          >
            ECLAT SHOP
          </p>
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
);
};

export default MyNavbar;