import { useEffect, useState, useTransition } from "react";
import type { Product } from "../types/products";
import api from "../utils/axios";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import { useSearchParams } from "react-router-dom";
import PaginationBar from "@/components/PaginationBar";
import Filters from "@/components/Filters";

const PAGE_SIZE = 12;

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const searchQuery = searchParams.get("q") || "";
  const orderBy = searchParams.get("orderBy") || "";
  const orderDir = searchParams.get("order") || "";

  useEffect(() => {
    startTransition(() => {
      api
        .get<Product[]>("/products", {
          params: {
            page,
            limit: PAGE_SIZE,
            searchQuery,
            orderBy,
            orderDir,
          },
        })
        .then((res) => {
          setProducts(res.data);
          const count = parseInt(res.headers["x-total-count"] || "0", 10);
          setTotalCount(count);
        })
        .catch(() => alert("Failed to load Product"));
    });
  }, [page, searchQuery, orderBy, orderDir]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", newPage.toString());
      return params;
    });
  };

  return (
    <div className="p-6">
      <Filters />
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

      <PaginationBar
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
