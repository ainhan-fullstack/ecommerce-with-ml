import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import NavBar from "./components/NavBar";
import CategoryBar from "./components/CategoryBar";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

function App() {
  const location = useLocation();
  const showCategoryBar =
    location.pathname === "/products" ||
    location.pathname.startsWith("/products/") ||
    location.pathname.startsWith("/category/");
  return (
    <>
      {showCategoryBar && (
        <>
          <NavBar />
          <CategoryBar />
        </>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
