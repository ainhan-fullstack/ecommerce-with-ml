import type { Category } from "@/types/products";

const CategoryBar = () => {
  const categories: Category[] = ["Clothing", "Home", "Beauty", "Food", "Pets"];

  return (
    <div className="w-full bg-gray-50 shadow flex items-center justify-center gap-4 px-8 py-3 mt-16">
      {categories.map((category) => (
        <button
          key={category}
          className="px-4 py02 rounded text-xl font-semibold hover:bg-primary hover:text-white transition cursor-pointer"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
