import { useState, useRef, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Link,
} from "@nextui-org/react";
import Lottie from "lottie-react";
import buy_animation from "../animations/buy-animation.json";
import anime from "animejs";

export default function CheckoutForm({
  sessionId,
  productResume,
}: {
  sessionId: any;
  productResume: any;
}) {
  const stripe = useStripe();
  const [buttonClicked, setButtonClicked] = useState(false);
  const buttonRef = useRef(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setButtonClicked(true);

    if (!stripe) {
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log("[error]", error);
    }
  };

  useEffect(() => {
    anime({
      targets: buttonRef.current,
      translateY: [-250, 0],
      duration: 300, // Réduire la durée de l'animation
    });
  }, []);

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
            CHECKOUT
          </h1>
          <Lottie animationData={buy_animation} loop={true} />
        </CardHeader>
        <Divider />
        <CardBody>{productResume}</CardBody>
        <Divider />
        <CardFooter
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
        >
          <Button
            ref={buttonRef}
            onClick={handleSubmit}
            className={`bg-gradient-to-r from-blue-600 to-pink-600 w-full`}
          >
            Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}