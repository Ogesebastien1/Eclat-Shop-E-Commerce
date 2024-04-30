import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "../components/Checkout";
import { Spinner } from "@nextui-org/react";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

export default function Payment({
  currency = "eur",
  productName = "Test Product",
  unitAmount = 1099,
  quantity = 1,
  productResume = "Test Product - 10.99€",
}) {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Spinner color="default" />
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