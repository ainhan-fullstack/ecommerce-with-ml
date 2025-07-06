import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/ecommerce-random-logo.webp";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryBar from "./CategoryBar";
import { useCart } from "@/hook/useCart";

const NavBar = () => {
  const [showBurger, setShowBurger] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setShowBurger(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showBurger && menuOpen) setMenuOpen(false);
  }, [showBurger, menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };
  return (
    <>
      <nav className="w-full bg-white shadow flex items-center justify-between px-8 h-16 fixed top-0 left-0 z-50">
        <div className="flex items-center">
          {showBurger && (
            <button className="mr-4" onClick={handleMenuToggle}>
              {menuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          )}
          <Link to={"/"}>
            <img src={logo} alt="Logo" className="w-15 h-15 object-contain" />
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="w-1/2">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search product..."
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </form>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-1 hover:text-primary"
            onClick={() => {
              window.location.href = "/profile";
            }}
          >
            <User className="w-5 h-5" />
            <span>User Profile</span>
          </button>
          <button
            className="relative flex items-center gap-1 hover:text-primary"
            onClick={() => {
              window.location.href = "/cart";
            }}
          >
            <span className="absolute -top-2 -right-4 bg-red-500 text-white rounded-full text-xs px-1">
              {cartCount}
            </span>
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full z-40">
          <CategoryBar />
        </div>
      )}
    </>
  );
};

export default NavBar;
