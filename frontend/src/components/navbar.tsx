// Navbar.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownMenu, Dropdown, DropdownTrigger, Avatar } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';

interface User {
  avatar: string;
  email: string;
}

const MyNavbar = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const { isLoggedIn, userData} = useContext(LoginContext) as unknown as { isLoggedIn: boolean, userData: User };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  console.log("userData", userData);

  useEffect(() => {
    console.log(isLoggedIn);
  }
  , [isLoggedIn]);
  
  return (
    <Navbar style={{zIndex : 1}}>
      <div className="flex justify-between items-center w-full" >
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
        <NavbarContent className="hidden sm:flex gap-3"  style={{ marginRight: '22%' }}>
          <NavbarItem>
            <Link color="foreground" href="/contact">
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
        <Dropdown placement="bottom-end">
        <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="secondary"
          size="sm"
          src={isLoggedIn && userData.avatar ? userData.avatar :  "https://static.thenounproject.com/png/929024-200.png"}
        />
      </DropdownTrigger>
          {isLoggedIn ? (
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userData.email}</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                  Log Out
                </DropdownItem>
            </DropdownMenu>
          ) : (
            <DropdownMenu aria-label="Guest Actions" variant="flat">
              <DropdownItem key="login" onClick={() => navigate('/login')}>Sign In</DropdownItem>
              <DropdownItem key="signup" onClick={() => navigate('/Register')}>Sign Up</DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default MyNavbar;