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
} from "@nextui-org/react";
import { LoginContext } from "../contexts/LoginContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  photo: string;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { userData } = useContext(LoginContext);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (userData && userData.roles && !userData.roles.includes("ROLE_ADMIN")) {
      navigate("/");
    }
  }, [userData]);

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
          <Listbox
            items={products}
            label="Products"
            selectionMode="single"
            onSelectionChange={(selected) =>
              navigate(`/edit-product/${selected}`)
            }
          >
            {(product) => (
              <ListboxItem
                key={product.id}
                textValue={product.name}
                className="w-full"
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
                <div className="w-full mt-2 mb-2">
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
    </div>
  );
};

export default ProductList;
