import { createContext, useContext, useState, type ReactNode } from "react";

type CartContextType = {
  cartCount: number;
  addToCart: (productId: number, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider.");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = (productId: number, quantity: number) =>
    setCartCount((prev) => prev + quantity);

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
