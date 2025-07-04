import type { Category } from "@/types/products";
import { useNavigate } from "react-router-dom";

const CategoryBar = () => {
  const categories: Category[] = ["Clothing", "Home", "Beauty", "Food", "Pets"];
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-50 shadow flex items-center justify-center gap-4 px-8 py-3 mt-16">
      {categories.map((cat) => (
        <button
          key={cat}
          className="px-4 py02 rounded text-xl font-semibold hover:bg-primary hover:text-white transition cursor-pointer"
          onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
