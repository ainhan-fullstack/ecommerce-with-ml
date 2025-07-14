export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  stripe_payment_intent: string;
  payment_status: string;
  created_at: string;
  items: OrderItem[];
}
