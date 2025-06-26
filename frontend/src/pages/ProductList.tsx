import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import api from "../utils/axios";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load products."));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg p-4 shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 flex flex-col"
        >
          <div className="flex justify-center mb-3">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto mb-3 scrollbar-thin scrollbar-thumb-gray-400">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} detail ${i + 1}`}
                  className="w-16 h-16 object-cover rounded border flex-shrink-0 hover:ring-2 hover:ring-blue-400 transition"
                />
              ))}
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="font-bold text-lg text-green-600">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className="text-xs text-yellow-500 flex items-center gap-1">
              ★ {product.rating}
            </span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
              {product.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
