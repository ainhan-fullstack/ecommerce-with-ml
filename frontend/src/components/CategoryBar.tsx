import type { Category } from "@/types/products";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CategoryBar = () => {
  const categories: Category[] = ["Clothing", "Home", "Beauty", "Food", "Pets"];
  const [category, setCategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (category) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("category", category);
        return params;
      });
    } else {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete("category", category);
        return params;
      });
    }
  }, [searchParams]);

  return (
    <div className="w-full bg-gray-50 shadow flex items-center justify-center gap-4 px-8 py-3 mt-16">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => {
            setCategory(category.toLowerCase());
            setSearchParams({ category: category.toLowerCase() });
          }}
          className="px-4 py02 rounded text-xl font-semibold hover:bg-primary hover:text-white transition cursor-pointer"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
