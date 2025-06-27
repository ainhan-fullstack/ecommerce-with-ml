import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import api from "../utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get<Product[]>("/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Failed to load products."));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-5">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-col items-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-40 h-40 object-cover rounded-lg mb-2 border"
            />
            <CardTitle className="text-lg font-semibold text-center">
              <Link to={`/products/${product.id}`} className="cursor-pointer">
                {product.name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 font-bold text-xl">
                ${Number(product.price).toFixed(2)}
              </span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {product.rating}
              </Badge>
            </div>
            <div className="flex-grow" />
            <button className="w-full mt-4 bg-primary text-white py-2 rounded hover:bg-primary/90 transition cursor-pointer">
              Add to cart
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;
