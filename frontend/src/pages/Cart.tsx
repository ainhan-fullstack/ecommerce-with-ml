import { useCart } from "@/hook/useCart";
import type { Cart } from "@/types/cart";
import { fetchWithAuth, postWithAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Cart = () => {
  const { cartCount } = useCart();
  const [cart, setCart] = useState<Cart>();
  const [deliveryFee, setDeliveryFee] = useState(0);

  const getCart = async () => {
    const cartRes = await fetchWithAuth("/cart");
    setCart(cartRes?.data);
  };

  const handleChangingQuantity = async (
    product_id: number,
    quantity: number
  ) => {
    const currentQuantity = cart?.products.find(
      (p) => p.id === product_id
    )?.quantity;
    if (currentQuantity === undefined) return;
    const diffQuantity = quantity - currentQuantity;
    await postWithAuth("/cart", { product_id, quantity: diffQuantity });
    getCart();
  };

  useEffect(() => {
    getCart();
  }, []);
  return (
    <div>
      <h1>Your Cart ({cartCount || 0} items)</h1>

      {cart?.products.map((p) => (
        <div className="grid grid-cols-4 gap-4" key={`cart_product_${p.id}`}>
          <div>
            <p>Item</p>
            <div className="flex justify-center items-center gap-2">
              <img src={p.thumbnail} alt={p.title} className="w-24 h-24" />
              <span>{p.title}</span>
            </div>
          </div>
          <div>
            <p>Price</p>
            <p>${p.price}</p>
          </div>
          <div>
            <p>Quantity</p>
            <form>
              <div className="relative flex items-center max-w-[8rem]">
                <button
                  type="button"
                  id="decrement-button"
                  disabled={p.quantity === 1}
                  onClick={() => handleChangingQuantity(p.id, p.quantity - 1)}
                  data-input-counter-decrement="quantity-input"
                  className={`bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none ${
                    p.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 2"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h16"
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  id="quantity-input"
                  data-input-counter
                  aria-describedby="helper-text-explanation"
                  className={`bg-gray-50 border-x-0 border-gray-300 h-11 text-black text-center text-sm front-bold focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 ${
                    p.quantity === p.stock_quantity
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  value={p.quantity}
                  min={1}
                  max={p.stock_quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= p.stock_quantity)
                      handleChangingQuantity(p.id, val);
                  }}
                  required
                />
                <button
                  type="button"
                  id="increment-button"
                  disabled={p.quantity === p.stock_quantity}
                  onClick={() => handleChangingQuantity(p.id, p.quantity + 1)}
                  data-input-counter-increment="quantity-input"
                  className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3 text-gray-900 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <div>
            <p>Total</p>
            <p>${p.total}</p>
          </div>
        </div>
      ))}
      <div>
        <h2>Delivery Service:</h2>
        <Select
          onValueChange={(value) => {
            if (value === "standard") {
              setDeliveryFee(10);
            } else if (value === "express") {
              setDeliveryFee(15);
            } else {
              setDeliveryFee(0);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard delivery</SelectItem>
            <SelectItem value="express">Express delivery</SelectItem>
          </SelectContent>
        </Select>
        <p>Fee:${deliveryFee}</p>
      </div>
      <div>
        <p>Subtotal:</p>
        <p>${cart?.total}</p>
      </div>
      <div>
        <p>Grand total:</p>
      </div>
      <button>Checkout</button>
    </div>
  );
};

export default Cart;
