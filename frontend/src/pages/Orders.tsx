import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hook/useCart";
import type { Order, OrderItem } from "@/types/order";
import type { Product } from "@/types/products";
import { fetchWithAuth, postWithAuth } from "@/utils/auth";
import { useEffect, useState } from "react";

interface OrderItemWithProduct extends OrderItem {
  product?: Product;
}

interface OrderWithDetails extends Order {
  items: OrderItemWithProduct[];
}

const Orders = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const { clearCart, refresh } = useCart();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchWithAuth("/orders");
        const ordersData: Order[] = res?.data || [];

        const ordersWithProducts = await Promise.all(
          ordersData.map(async (order) => {
            const itemsWithProducts = await Promise.all(
              order.items.map(async (item) => {
                try {
                  const productRes = await fetchWithAuth(
                    `/products/${item.product_id}`
                  );
                  const product: Product | undefined = productRes?.data?.[0];
                  return { ...item, product };
                } catch {
                  return item;
                }
              })
            );
            return { ...order, items: itemsWithProducts };
          })
        );

        setOrders(ordersWithProducts);
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

  const handleCancelOrder = async (orderId: number) => {
    try {
      await postWithAuth("/cancel-order", { orderId });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.map((order) => (
        <Card key={`order_${order.id}`}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>
                Order #{order.id} - {new Date(order.created_at).toDateString()}
              </span>
              {order.status === "pending" && (
                <Button
                  className="cursor-pointer"
                  onClick={() => handleCancelOrder(order.id)}
                >
                  Cancel Order
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4 text-sm">
              <span>Status: {order.status}</span>
              <span>Total: ${order.total_amount}</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2 px-2 font-bold">Item</th>
                  <th className="py-2 px-2 font-bold">Price</th>
                  <th className="py-2 px-4 font-bold">Quantity</th>
                  <th className="py-2 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={`item_${item.id}`}
                    className="border-b last:border-none"
                  >
                    <td className="py-2 flex items-center gap-3">
                      {item.product && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover border"
                        />
                      )}
                      <div>
                        {item.product
                          ? item.product.name
                          : `Product ${item.product_id}`}
                      </div>
                    </td>
                    <td className="py-2">${item.price}</td>
                    <td className="py-2 px-12">{item.quantity}</td>
                    <td className="py-2">${item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
      {orders.length === 0 && <p>No orders found.</p>}
    </div>
  );
};

export default Orders;
