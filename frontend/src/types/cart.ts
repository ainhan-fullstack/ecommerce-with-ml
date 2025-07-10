export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
  stock_quantity: number;
}

export interface Cart {
  id: number | null;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  deliveryMethod: string | null;
  deliveryFee: number;
  totalProducts: number;
  totalQuantity: number;
  grandTotal: number;
}
