import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Cart } from "@/types/cart";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, postWithAuth } from "@/utils/auth";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/orders",
      },
    });
    if (error) setMessage(error.message ?? "Payment failed.");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement id="payment-element" />
      {message && <div className="text-red-600">{message}</div>}
      <Button type="submit" className="w-full" disabled={!stripe}>
        Pay
      </Button>
    </form>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const cartRes = await fetchWithAuth("/cart");
        const c: Cart = cartRes?.data;
        if (!c || c.products.length === 0) {
          navigate("/cart");
          return;
        }

        setCart(c);

        const items = c.products.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
          price: p.price,
        }));

        const orderRes = await postWithAuth("/orders", {
          items,
          delivery_fee: c.deliveryFee,
        });

        setClientSecret(orderRes?.data.clientSecret);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [navigate]);
  if (!publishableKey) {
    return (
      <div className="p-8 text-red-600">
        Stripe publishable key is not configured.
      </div>
    );
  }
  if (!clientSecret) return <div className="p-8">Loading...</div>;
  return (
    <div>
      <h1>Checkout</h1>
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};

export default Checkout;
