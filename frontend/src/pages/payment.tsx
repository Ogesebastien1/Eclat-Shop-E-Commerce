import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "../components/Checkout";
import Lottie from "lottie-react";
import { useTheme } from "../contexts/themeContext";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

function Payment(props: any) {
  let currency = "usd";
  let productName = "Product";
  let unitAmount = 0;
  let quantity = 1;
  let productResume = "";

  try {
    currency = props.location.state.currency || "usd";
    productName = props.location.state.productName || "Product";
    unitAmount = props.location.state.unitAmount || 0;
    quantity = props.location.state.quantity || 1;
    productResume = props.location.state.productResume || "";
  } catch (e) {
    console.error(e);
  }

  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  let animationData = theme == "dark" ? darkanimation : lightanimation;

  useEffect(() => {
    axios
      .post("http://localhost:8000/api/payment/create-checkout-session", {
        items: [
          {
            currency: currency,
            productName: productName,
            unitAmount: unitAmount,
            quantity: quantity,
          },
        ],
      })
      .then((res) => {
        setSessionId(res.data.id);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={animationData} width={400} height={400} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {sessionId && (
        <Elements stripe={stripePromise}>
          <CheckoutForm sessionId={sessionId} productResume={productResume} />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
