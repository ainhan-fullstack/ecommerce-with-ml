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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState<Cart>();
  const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);
  const navigate = useNavigate();

  const getCart = async () => {
    const cartRes = await fetchWithAuth("/cart");
    setCart(cartRes?.data);
    setDeliveryMethod(cartRes?.data.deliveryMethod);
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

  const updateDelivery = async (
    deliveryMethod: string,
    deliveryFee: number
  ) => {
    await postWithAuth("/cart/delivery", {
      delivery_method: deliveryMethod,
      delivery_fee: deliveryFee,
    });
    getCart();
  };

  const removeItems = async (productId: number) => {
    await postWithAuth(`/cart/delete`, {
      cartId: cart?.id,
      productId,
    });
    getCart();
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div className="container mx-auto p-2 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Your Cart ({cart?.totalQuantity || 0} items)
      </h1>

      <div className="md:flex md:gap-8">
        <Card className="flex-1 rounded-md shadow mb-8 md:mb-0">
          <CardContent className="p-0">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b text-gray-600 text-sm">
                  <th className="py-3 px-2 font-bold w-2/5">Item</th>
                  <th className="py-3 px-2 font-bold w-1/5">Price</th>
                  <th className="py-3 px-2 font-bold w-1/5">Quantity</th>
                  <th className="py-3 px-2 font-bold w-1/5">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart?.products.map((p) => (
                  <tr
                    key={`product_${p.id}`}
                    className="border-b last:border-none"
                  >
                    <td className="py-4 px-2 flex items-center gap-4">
                      <img
                        src={p.thumbnail}
                        alt={p.title}
                        className="w-16 h-16 rounded object-cover border"
                      />
                      <div>
                        <div className="font-semibold">{p.title}</div>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium text-gray-800">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-2">
                      <form className="max-w-xs mx-auto">
                        <div className="relative flex items-center max-w-[8rem]">
                          <button
                            type="button"
                            id="decrement-button"
                            onClick={() =>
                              handleChangingQuantity(p.id, p.quantity - 1)
                            }
                            data-input-counter-decrement="quantity-input"
                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
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
                            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={p.quantity}
                            required
                          />
                          <button
                            type="button"
                            id="increment-button"
                            onClick={() =>
                              handleChangingQuantity(p.id, p.quantity + 1)
                            }
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
                    </td>
                    <td className="py-4 px-2 font-medium">
                      ${p.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Remove"
                        onClick={() => {
                          removeItems(p.id);
                        }}
                      >
                        <Trash className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="md:w-96 md:min-w-[320px] w-full flex flex-col gap-4">
          <div className="mb-2">
            <label className="font-semibold text-sm text-gray-700 mb-2 block">
              Delivery Service
            </label>
            <Select
              value={deliveryMethod || undefined}
              onValueChange={(value) => {
                setDeliveryMethod(value);
                if (value === "standard") {
                  updateDelivery("standard", 10);
                } else if (value === "express") {
                  updateDelivery("express", 15);
                } else {
                  updateDelivery("none", 0);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">
                  Standard delivery ($10)
                </SelectItem>
                <SelectItem value="express">Express delivery ($15)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card className="rounded-xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ${cart?.total?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Shipping fee:</span>
                <span className="font-semibold">
                  ${cart?.deliveryFee || "0.00"}
                </span>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between items-center text-xl font-bold">
                <span>Grand total:</span>
                <span>${cart?.grandTotal?.toFixed(2) || "0.00"}</span>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => navigate("/checkout")}
              >
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
