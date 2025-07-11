import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import NavBar from "./components/NavBar";
import CategoryBar from "./components/CategoryBar";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const showCategoryBar =
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/cart");
  return (
    <>
      {showCategoryBar && (
        <>
          <NavBar />
          <CategoryBar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<ProductList />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
