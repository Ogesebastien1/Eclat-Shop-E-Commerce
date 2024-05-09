import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";


const Cart = () => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
    const fetchCartItems = async () => {
        try {
        const response = await axios.get("http://localhost:8000/api/carts", { withCredentials: true });
        console.log("Cart items:", response.data.cart);
        } catch (error) {
        console.error("Error fetching cart items:", error);
        }
    };

    fetchCartItems();
    }, []);

  return (
    <>
      <Button
        style={{ position: "fixed", bottom: "0", right: "0", margin: "10px" }}
        onPress={onOpen}
      >
        Cart
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Your cart
              </ModalHeader>
              <ModalBody>
                <div>
                  <p>Your Items:</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
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
