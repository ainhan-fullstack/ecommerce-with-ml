import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hook/useCart";
import type { Order } from "@/types/order";
import { fetchWithAuth } from "@/utils/auth";
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { clearCart, refresh } = useCart();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchWithAuth("/orders");
        setOrders(res?.data || []);
      } catch (err) {
        console.log(err);
      }
    };
    loadOrders();
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("redirect_status") === "succeeded" ||
      params.has("payment_intent")
    ) {
      clearCart().then(() => refresh());
    }
  }, [clearCart, refresh]);
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.map((order) => (
        <Card key={`order_${order.id}`}>
          <CardHeader>
            <CardTitle>
              Order #{order.id} - {new Date(order.created_at).toDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span>Status: {order.status}</span>
              <span>Total: {order.total_amount}</span>
            </div>
            <ul className="list-disc pl-5">
              {order.items.map((item) => (
                <li key={`item_${item.id}`} className="text-sm">
                  Product {item.id} x {item.quantity} @ {item.price}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
};

export default Orders;
