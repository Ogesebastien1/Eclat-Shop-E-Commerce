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

const Cart = ({ cartUpdated = false }: { cartUpdated?: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cartData, setCartData] = useState(null);
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, [cartUpdated]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    axios
      .get("http://localhost:8000/api/carts", {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        setCartData(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const deleteFromCart = (productId: any, event: any) => {
    axios
      .delete(`http://localhost:8000/api/carts/remove/${productId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
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

  const purgeFromCard = (productId: any, event: any) => {
    axios
      .delete(`http://localhost:8000/api/carts/purge/${productId}`, {
        withCredentials: true,
      })
      .then((response) => {
        fetchCartItems();
      })
      .catch((error) => {
        console.error("There was an error!", error);
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

  const addToCart = (productId: any, productName: string, event: any) => {
    axios
      .post(`http://localhost:8000/api/carts/${productId}`, null, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        fetchCartItems();
      })
      .catch((error) => {
        console.error("There was an error!", error);
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
                            boxShadow:
                              "0px 0px 1px 1px rgba(129, 32, 236, 0.7)",
                            borderRadius: "8px",
                            margin: "10px 0",
                          }}
                        >
                          <AccordionItem title={<div>{item.name}</div>}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "space-between",
                              }}
                            >
                              <p
                                style={{ margin: "5px 0", alignSelf: "center" }}
                              >
                                Quantity
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Button
                                  color="success"
                                  variant="light"
                                  onClick={(event) =>
                                    addToCart(key, item.name, event)
                                  }
                                >
                                  +
                                </Button>
                                <p style={{ margin: "5px" }}>{item.quantity}</p>
                                <Button
                                  color="danger"
                                  variant="light"
                                  onClick={(event) =>
                                    deleteFromCart(key, event)
                                  }
                                >
                                  -
                                </Button>
                              </div>
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
                                  onClick={(event) => purgeFromCard(key, event)}
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
