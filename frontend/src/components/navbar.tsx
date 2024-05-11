// Navbar.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  Avatar,
  Spinner,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";


interface User {
  avatar: string;
  email: string;
  login: string;
  roles: string[];
}

const MyNavbar = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const { isLoggedIn, userData, setToken, setLoggedIn } = useContext(LoginContext)

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token")
    setToken("")
    setLoggedIn(false)
    window.location.reload();
  };

  return (
    <Navbar style={{ position: "fixed", top: 0, zIndex: 1000, width: "100%",  }}>
      <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
        <NavbarBrand>
          <p
            className="font-bold text-inherit"
            onClick={() => navigate("/shop")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={hover ? { color: "#0067dd", cursor: "pointer" } : {}}
          >
            ECLAT SHOP
          </p>
        </NavbarBrand>
      </div>
      <div style={{ position: "absolute", top: "1.5rem", left: "50%", transform: "translate(-50%, -50%)", marginTop:"5px" }}>
        <NavbarContent>
          <NavbarItem>
            <Link color="foreground" href="/contact">
              Contact
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/aboutUs">
              About us
            </Link>
          </NavbarItem>
        </NavbarContent>
      </div>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              size="sm"
              src={
                isLoggedIn && userData?.avatar
                  ? userData.avatar
                  : "https://www.svgrepo.com/show/442075/avatar-default-symbolic.svg"
              }
            />
          </DropdownTrigger>
          {isLoggedIn && userData?.roles?.includes("ROLE_ADMIN") ? (
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" onClick={() => navigate("/settings")}>
                <p className="font-semibold">
                  Signed in as {userData?.login || "gest"}
                </p>
              </DropdownItem>
              <DropdownItem
                key="team_settings"
                onClick={() => navigate("/admin/add-product")}
              >
                Admin
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          ) : isLoggedIn ? (
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" onClick={() => navigate("/settings")}>
                <p className="font-semibold" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {userData?.login || "guest"}
                </p>
              </DropdownItem>
              
              <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          ) : (
            <DropdownMenu aria-label="Guest Actions" variant="flat">
              <DropdownItem key="login" onClick={() => navigate("/login")}>
                Sign In
              </DropdownItem>
              <DropdownItem key="signup" onClick={() => navigate("/Register")}>
                Sign Up
              </DropdownItem>
            </DropdownMenu>
          )}
        </Dropdown>
      </div>
    </Navbar >
  );
};

export default MyNavbar;
