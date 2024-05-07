import React, { useState, useContext } from "react";
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
  Image,
} from "@nextui-org/react";
import { LoginContext } from "../contexts/LoginContext";
import Lottie from "lottie-react";
import animationData from "../animations/settings-animation.json";
import { toast } from "react-toastify";

export const Settings = () => {
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token, userData } = useContext(LoginContext);

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
            `http://localhost:8000/api/users/${userData.id}/avatar`,
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setAvatar(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
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
          <Link
            href="/reset-password"
            className="center w-full mt-4"
            style={{
              fontSize: "0.8rem",
            }}
          >
            <Button fullWidth>Change your password</Button>
          </Link>
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
