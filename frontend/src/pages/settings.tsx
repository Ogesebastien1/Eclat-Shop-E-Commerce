import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Link,
  Spinner,
  Image,
} from "@nextui-org/react";
import { LoginContext } from "../contexts/LoginContext";
import Lottie from "lottie-react";
import animationData from "../animations/settings-animation.json";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useTheme } from "../contexts/themeContext";

export const Settings = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, userData, setLoggedIn } = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  let backgroundcolor = theme == "dark" ? "#18181b" : "white";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (avatar) {
      const reader = new FileReader();
      reader.readAsDataURL(avatar);
      reader.onloadend = async () => {
        try {
          const base64Avatar = reader.result;
          const response = await axios.put(
            `http://localhost:8000/api/user/avatar`,
            { avatar: base64Avatar },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            }
          );
          setIsLoading(false);
          toast.success("Avatar updated successfully");
        } catch (error: any) {
          setIsLoading(false);
          toast.error("An error occurred while updating the avatar");
        }
      };
      reader.onerror = () => {
        setIsLoading(false);
        toast.error("An error occurred while encoding the avatar");
      };
    } else {
      setIsLoading(false);
      toast.error("No avatar selected");
    }
  };

  const handleChangePassword = async () => {
    try {
      const formData = {
        email: userData?.email,
      };
      await axios.post(`http://localhost:8000/api/reset-password/update`, {
        headers: {
          "Content-Type": "application/json",
        },
        content: formData,
      });
      toast.success(
        "An email has been sent to your email address with a link to change your password.",
        { autoClose: 5000 }
      );
      setLoggedIn(false);
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while sending the email.", {
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    backgroundcolor = theme == "dark" ? "#18181b" : "white";
  }, [theme]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };

  const handleDeleteAccount = () => {
    setIsModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      setLoggedIn(false);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      toast.error("An error occurred while deleting your account.");
    }
    setIsModalOpen(false);
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
        href="/shop"
        style={{ position: "absolute", top: "1rem", left: "1rem" }}
      >
        ← Back to shop
      </Link>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Delete Account Confirmation"
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
        <h2 className="text-2xl font-bold mb-4 text-center">
          Are you sure you want to delete your account?
        </h2>
        <p className="text-lg mb-8 text-center">
          This action cannot be undone.
        </p>
        <Button
          color="danger"
          onClick={confirmDeleteAccount}
          className="w-full mb-4"
        >
          Yes, delete my account
        </Button>
        <Button
          color="success"
          onClick={() => setIsModalOpen(false)}
          className="w-full"
        >
          No, keep my account
        </Button>
      </Modal>
      <Card className="max-w-[400px]">
        <CardHeader className="center flex-col">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
            ACCOUNT SETTINGS
          </h1>
          <div className="w-40 h-40">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="center flex-col justify-center">
          <Card isFooterBlurred radius="lg" className="border-none">
            <div className="bg-gradient-to-r from-blue-600 to-pink-600 flex items-center justify-center">
              <Image
                alt="User avatar"
                className="object-cover rounded-full"
                height={200}
                src={
                  avatarPreview
                    ? avatarPreview
                    : userData && userData.avatar
                    ? userData.avatar
                    : "https://www.svgrepo.com/show/442075/avatar-default-symbolic.svg"
                }
                width={200}
              />
            </div>
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">Change your avatar</p>
              <label className="text-tiny text-white bg-black/20 cursor-pointer flex justify-center items-center p-1 rounded-lg">
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
                Upload
              </label>
            </CardFooter>
          </Card>
          <Button
            fullWidth
            className="center w-full mt-4 mb-4"
            onClick={handleChangePassword}
          >
            Change your password
          </Button>
          <Button color="danger" onClick={handleDeleteAccount}>
            Delete your account
          </Button>
        </CardBody>
        <Divider />
        <CardFooter>
          <Button
            onClick={handleUpdate}
            className="bg-sky-400 w-full"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" /> : "Update"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
