import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductList from "./pages/ProductList";
import NavBar from "./components/NavBar";
import CategoryBar from "./components/CategoryBar";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <>
      <NavBar />
      <CategoryBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products/:category" element={<ProductList />} />
      </Routes>
    </>
  );
}

export default App;
