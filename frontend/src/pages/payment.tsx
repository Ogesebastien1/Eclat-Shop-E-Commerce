import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import CheckoutForm from "../components/Checkout";
import Lottie from "lottie-react";
import { useTheme } from "../contexts/themeContext";
import darkanimation from "../animations/dark-loading.json";
import lightanimation from "../animations/light-loading.json";
import { useParams } from "react-router-dom"; // Add this line

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || ""
);

function Payment() {
  const { commandId } = useParams<{ commandId: string }>(); // Get the command ID from the URL
  const [paymentDetails, setPaymentDetails] = useState(null); // State to store the payment details
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
      });

    // axios
    //   .post("http://localhost:8000/api/payment/create-checkout-session", {
    //     items: [
    //       {
    //         currency: paymentDetails?.productPrices?.currency,
    //         productName: paymentDetails?.productList?.productName,
    //         unitAmount: paymentDetails?.productPrices?.unitAmount,
    //         quantity: paymentDetails?.productList?.quantity,
    //       },
    //     ],
    //   })
    //   .then((res) => {
    //     setSessionId(res.data.id);
    //     setLoading(false);
    //   });
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
            productResume={paymentDetails?.productList}
          />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
