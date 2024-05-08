import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Listbox,
  ListboxItem,
  Avatar,
  Card,
  Link,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Input,
} from "@nextui-org/react";
import { LoginContext } from "../contexts/LoginContext";
import Modal from "react-modal";
import { useTheme } from "../contexts/themeContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  photo: Blob | null;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { userData, isLoggedIn } = useContext(LoginContext);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { theme } = useTheme();
  let backgroundcolor = theme == "dark" ? "#18181b" : "white";

  useEffect(() => {
    if (
      (userData && userData.roles && !userData.roles.includes("ROLE_ADMIN")) ||
      !userData ||
      !isLoggedIn
    ) {
      navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    backgroundcolor = theme == "dark" ? "#18181b" : "white";
  }, [theme]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{
          status: string;
          products: Product[];
        }>(`http://localhost:8000/api/products`);
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("API response does not contain an array of products");
          console.error(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    const product = products.find((product) => product.id === id);
    if (product) {
      setSelectedProduct(product);
      setModalIsOpen(true);
    }
  };

  const handleUpdate = async () => {
    if (selectedProduct) {
      try {
        let productDetails;
        // Prepare the product details
        if (!image) {
          productDetails = {
            name: selectedProduct.name,
            description: selectedProduct.description,
            price: selectedProduct.price,
            stock: selectedProduct.stock,
          };
          console.log("photo is not set");
          // Send the PUT request
          const response = await axios.put(
            `http://localhost:8000/api/products/${selectedProduct.id}`,
            productDetails,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log(response.data);
          setProducts(
            products.map((product) =>
              product.id === selectedProduct.id
                ? response.data.product
                : product
            )
          );
          setModalIsOpen(false);
          setImage(null);
        } else {
          // Convert the image to Base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result;
            productDetails = {
              name: selectedProduct.name,
              description: selectedProduct.description,
              price: selectedProduct.price,
              stock: selectedProduct.stock,
              photo: base64Image, // send the image as a Base64 string
            };
            console.log("photo is set");

            // Send the PUT request
            const response = await axios.put(
              `http://localhost:8000/api/products/${selectedProduct.id}`,
              productDetails,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            console.log(response.data);
            setProducts(
              products.map((product) =>
                product.id === selectedProduct.id
                  ? response.data.product
                  : product
              )
            );
            setModalIsOpen(false);
            setImage(null);
          };
          reader.onerror = (error) => {
            console.error("Error: ", error);
            setImage(null);
          };
          reader.readAsDataURL(image);
          setImage(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Link
        href="/"
        style={{ position: "absolute", top: "1rem", left: "1rem" }}
      >
        ← Back to Home
      </Link>
      <Link
        href="/admin/add-product"
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        Add product →
      </Link>
      <Card className="center flex max-w-7xl min-w-96">
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            Products
          </h1>
        </CardHeader>
        <Divider />
        <CardBody className="center flex-col justify-center">
          <Listbox items={products} label="Products" selectionMode="single">
            {(product) => (
              <ListboxItem
                key={product.id}
                textValue={product.name}
                className="p-2 w-full pl-5 pr-0"
                onClick={() => handleEdit(product.id)}
              >
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={product.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={product.photo}
                  />
                  <div className="flex flex-col">
                    <span className="text-small">{product.name}</span>
                    <span className="text-tiny text-default-400">
                      {product.description}
                    </span>
                    <span className="text-tiny text-default-400">
                      {product.stock}
                    </span>
                    <span className="text-tiny text-default-400">
                      {product.price} €
                    </span>
                  </div>
                </div>
                <div className="flex justify-center m-1">
                  <Button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 w-full"
                    disabled={deletingId !== null}
                  >
                    {deletingId === product.id ? (
                      <Spinner color="default" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </ListboxItem>
            )}
          </Listbox>
        </CardBody>
      </Card>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: backgroundcolor,
            borderRadius: "14px",
          },
        }}
      >
        {selectedProduct && (
          <>
            <Input
              label="Name"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="mb-4"
            />
            <Input
              label="Description"
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mb-4"
            />
            <Input
              label="Price"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="mb-4"
            />
            <Input
              label="Stock"
              value={selectedProduct.stock}
              onChange={(e) =>
                setSelectedProduct((prev) => ({
                  ...prev,
                  stock: e.target.value,
                }))
              }
              className="mb-4"
            />
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Button onClick={handleUpdate} className="bg-blue-600 w-full mt-4">
              Update Product
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
