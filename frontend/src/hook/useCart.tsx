import { fetchWithAuth, postWithAuth } from "@/utils/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type CartContextType = {
  cartCount: number;
  addToCart: (productId: number, quantity: number) => void;
  refresh: () => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider.");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (productId: number, quantity: number) => {
    const res = await postWithAuth("/cart", {
      product_id: productId,
      quantity,
    });
    setCartCount(res?.data.totalProducts);
  };

  const refresh = async () => {
    try {
      const res = await fetchWithAuth("/cart");
      setCartCount(res?.data.totalProducts);
    } catch (err) {
      console.error("Failed to load cart.");
    }
  };

  const clearCart = async () => {
    await postWithAuth("/cart/clear", {});
    setCartCount(0);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, refresh, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
