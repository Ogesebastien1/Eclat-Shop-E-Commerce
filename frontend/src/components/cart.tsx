import React, { useEffect, useState, useContext } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  Image,
  Divider,
  Accordion,
  AccordionItem,
  Badge,
  Avatar,
} from "@nextui-org/react";
import axios from "axios";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cartData, setCartData] = useState(null);
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    //print content of the cookie

    axios
      .get("http://localhost:8000/api/carts", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setCartData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const deleteFromCart = (productId: any, event: any) => {
    console.log("Product ID:", productId);
    console.log(cartData);
    axios
      .delete(`http://localhost:8000/api/carts/remove/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        fetchCartItems();
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response) {
          console.error(
            "Server responded with status code",
            error.response.status
          );
          console.error("Response data:", error.response.data);
        }
      });
  };

  const checkoutCart = () => {
    if (cartData && Object.keys((cartData as any).cart).length === 0) {
      alert("Votre panier est vide");
      return;
    }

    axios
      .post(
        `http://localhost:8000/api/carts/validate`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        // Vous pouvez rediriger l'utilisateur vers une page de confirmation de commande ici, par exemple :
        navigate(`/delivery?command=${response.data.ordersId}`);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        if (error.response) {
          console.error(
            "Server responded with status code",
            error.response.status
          );
          console.error("Response data:", error.response.data);
        }
      });
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: "1rem",
          right: "1rem",
        }}
      >
        <Badge
          content={cartData ? Object.keys((cartData as any).cart).length : 0}
          color={
            cartData && Object.keys((cartData as any).cart).length > 0
              ? "success"
              : "danger"
          }
        >
          <Avatar
            radius="md"
            onClick={onOpen}
            src="https://stg16-bucketimage.s3.eu-west-3.amazonaws.com/Shopping+Bag+Icon.svg"
            className="cursor-pointer bg-transparent hover:bg-transparent"
          />
        </Badge>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1
                  className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600"
                  style={{ alignSelf: "center" }}
                >
                  YOUR CART
                </h1>
              </ModalHeader>
              <ModalBody>
                {cartData && Object.keys((cartData as any).cart).length > 0 ? (
                  <div>
                    {Object.entries((cartData as any).cart).map(
                      ([key, item]: [string, any]) => (
                        <Accordion
                          key={key}
                          style={{
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
                            borderRadius: "8px",
                            margin: "10px 0",
                          }}
                        >
                          <AccordionItem
                            title={
                              <div style={{ textAlign: "center" }}>
                                {item.name}
                              </div>
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "space-between",
                              }}
                            >
                              <p style={{ margin: "5px" }}>
                                Quantity: {item.quantity}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <p style={{ margin: "5px" }}>
                                  Price: {item.price} €
                                </p>
                                <Button
                                  color="danger"
                                  variant="light"
                                  onClick={(event) =>
                                    deleteFromCart(key, event)
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </AccordionItem>
                        </Accordion>
                      )
                    )}
                    <p style={{ fontSize: "24px" }}>
                      Total: {(cartData as any).total} €
                    </p>
                  </div>
                ) : (
                  <p
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600"
                    style={{ alignSelf: "center" }}
                  >
                    Your cart is empty :(
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={checkoutCart}>
                  Validate
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Cart;
