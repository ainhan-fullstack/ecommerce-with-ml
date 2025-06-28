export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating: number;
}

export interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock_quantity: number;
  created_at: string;
  rating: number;
  images: string[];
}

export type Category = "Clothing" | "Home" | "Beauty" | "Food" | "Pets";
