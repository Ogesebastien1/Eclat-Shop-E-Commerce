// Navbar.tsx
import React, { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownMenu, Dropdown, DropdownTrigger, Avatar } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';


const MyNavbar = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);

  return (
    <Navbar>
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
        <NavbarContent className="hidden sm:flex gap-3"  style={{ marginRight: '23%' }}>
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
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default MyNavbar;