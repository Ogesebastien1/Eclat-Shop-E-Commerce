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
    products: {
      name: string;
      price: number;
      quantity: number;
      totalprice: number;
    }[];
  }
  const location = useLocation(); // Get the current location
  const search = location.search.substring(1); // Remove the '?' symbol
  const searchParams = new URLSearchParams(decodeURIComponent(atob(search)));
  const command = searchParams.get("command");
  const commandId = command ? command.replace(/[{}]/g, "") : "";
  const delivery = decodeURIComponent(searchParams.get("delivery") || "");
  const deliveryPrice = decodeURIComponent(searchParams.get("price") || "");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    products: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);

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
          let products = response.data.item.map((item: any) => ({
            name: item.product,
            price: item.price,
            quantity: item.quantity,
          }));

          // Add delivery to products
          products = [
            ...products,
            { name: delivery, price: deliveryPrice, quantity: 1 },
          ];

          setPaymentDetails({ products });
          // Set the total price
          setTotalPrice(response.data.totalPrice);
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
            productResume={paymentDetails?.products.map(
              (product: any, index: any) => ({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
              })
            )}
            // Pass the total price as a prop
            totalPrice={totalPrice}
            deliveryPrice={Number(deliveryPrice)}
          />
        </Elements>
      )}
    </div>
  );
}

export default Payment;
