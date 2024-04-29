import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/Checkout";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51H2nYdB8uQTceI1zCNSKq7fXG5JB6quW5TKClI00K2uxa6L2Wxe1sVHjy49BdSykYBLy3EwkfeEHYSeFSbwqjomM00Qm2uO5AS"
);

export default function Payment() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  };

  console.log(options);

  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
}
