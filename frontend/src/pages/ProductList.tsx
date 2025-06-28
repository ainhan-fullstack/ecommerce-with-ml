import { useEffect, useState, useTransition } from "react";
import type { Product } from "../types/products";
import api from "../utils/axios";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => {
        startTransition(() => {
          setProducts(res.data);
        });
      })
      .catch(() => alert("Failed to load products."));
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {isPending
          ? Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={`skeleton_product_list_${i}`} />
            ))
          : products.map((product) => (
              <ProductCard
                key={`product_list_${product.id}`}
                product={product}
              />
            ))}
      </div>
    </div>
  );
};

export default ProductList;
