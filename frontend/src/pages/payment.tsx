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
  const search = location.search.substring(1); // Remove the '?' symbol
  const searchParams = new URLSearchParams(decodeURIComponent(atob(search)));
  const command = searchParams.get("command");
  const commandId = command ? command.replace(/[{}]/g, "") : "";
  const delivery = decodeURIComponent(searchParams.get("delivery") || "");
  const deliveryPrice = decodeURIComponent(searchParams.get("price") || "");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    productList: [],
    productPrices: [],
  });
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  let animationData = theme == "dark" ? darkanimation : lightanimation;

  useEffect(() => {
    // Fetch the order details when the component mounts
    axios
      .get(`http://localhost:8000/api/orders/${commandId}`)
      .then((response) => {
        if (response.data.item) {
          // Extract productList and productPrices from the item array
          let productList = response.data.item.map((item: any) => item.product);
          let productPrices = response.data.item.map((item: any) => item.price);

          // Add delivery to productList and deliveryPrice to productPrices
          productList = [...productList, delivery];
          productPrices = [...productPrices, deliveryPrice];

          setPaymentDetails({ productList, productPrices });
        } else {
          console.error("item not defined in response data");
        }
        setLoading(false);

        // Create the items array
        const items = response.data.item.map((item: any) => ({
          productName: item.product,
          unitAmount: Math.round(item.price), // Convert to cents
          quantity: item.quantity,
          currency: "eur", // Adjust this to your actual currency
        }));

        // Add delivery information to the items array
        items.push({
          productName: delivery,
          unitAmount: Math.round(Number(deliveryPrice) * 100), // Convert to cents
          quantity: 1,
          currency: "eur", // Adjust this to your actual currency
        });

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
  }, [commandId, delivery, deliveryPrice]);

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
