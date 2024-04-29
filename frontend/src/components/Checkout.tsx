import { PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@nextui-org/react";

const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <Button color="primary">Pay</Button>
    </form>
  );
};

export default CheckoutForm;
