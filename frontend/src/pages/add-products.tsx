import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
  Link,
  Spinner,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

export const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(process.env.ACCESS_KEY_ID);
    console.log(process.env.SECRET_ACCESS_KEY);
  }, []);

  useEffect(() => {
    if (userData && userData.roles && !userData.roles.includes("ROLE_ADMIN")) {
      navigate("/");
    }
  }, [userData]);

  const handleAddProduct = async () => {
    if (!name || !description || !price || !image) {
      toast.error("Please fill in all fields correctly.");
      return;
    }
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("photo", image); // send the image file
      formData.append("stock", stock);

      await axios.post(`http://localhost:8000/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully.");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage(null);
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while adding the product.");
    } finally {
      setIsLoading(false);
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
        href="/admin/products"
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        Products List →
      </Link>
      <Card className="max-w-[400px]">
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            ADD PRODUCT
          </h1>
        </CardHeader>
        <Divider />
        <CardBody>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Input
              label="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              isRequired
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Image</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              margin: "1rem",
              width: "100%",
            }}
            onClick={handleAddProduct}
            className="bg-sky-400"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" /> : "Add Product"}
          </Button>
        </CardFooter>
        <Divider />
      </Card>
    </div>
  );
};

export default AddProduct;