import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "../components/Checkout";
import Lottie from "lottie-react";
import { useTheme } from "../contexts/themeContext";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import { useLocation } from "react-router-dom"; // Add this line

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

function Payment() {
  interface PaymentDetails {
    productList: string[];
    productPrices: number[];
    // Add other properties of paymentDetails here
  }
  const location = useLocation(); // Get the current location
  const command = new URLSearchParams(location.search).get("command");
  const commandId = command ? command.replace(/[{}]/g, "") : "";
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  let animationData = theme == "dark" ? darkanimation : lightanimation;

  useEffect(() => {
    // Fetch the payment details when the component mounts
    axios
      .get(`http://localhost:8000/api/payment/${commandId}`)
      .then((response) => {
        setPaymentDetails(response.data);
        console.log(response.data);
        setLoading(false);

        // Create the items array
        const items = response.data.productList.map(
          (productName: any, index: any) => ({
            productName,
            unitAmount: Math.round(response.data.productPrices[index] * 100), // Convert to cents
            quantity: 1, // Adjust this if you have quantity information
            currency: "eur", // Adjust this to your actual currency
          })
        );

        // Create the checkout session
        axios
          .post("http://localhost:8000/api/payment/create-checkout-session", {
            items,
          })
          .then((res) => {
            setSessionId(res.data.id);
            setLoading(false);
          });
      });
  }, [commandId]);

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
          <CheckoutForm
            sessionId={sessionId}
            productResume={paymentDetails?.productList.map(
              (product: any, index: any) => ({
                name: product,
                price: paymentDetails?.productPrices[index],
              })
            )}
          />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
