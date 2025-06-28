import { Button } from "@/components/ui/button";
import type { ProductDetails } from "@/types/products";
import api from "@/utils/axios";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);

  useEffect(() => {
    api
      .get(`/product/${id}`)
      .then((res) => setProduct(res.data[0]))
      .catch((err: any) => alert(err.response?.data[0]?.message));
  }, [id]);

  if (!product) return <div>404 not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              className="w-full h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="text-yellow-500 flex items-center">
            <Star className="w-4 h-4 fill-yellow-500 mr-1" /> {product.rating}
          </span>
          <span>| 999 Ratings |</span>
          <span>999 Sold</span>
          {/* <span>({product.reviews.length} reviews)</span> */}
        </div>
        <div className="flex items-center gap-4 text-3xl font-bold text-red-500">
          ${product.price}
          {/* <span className="text-base line-through text-gray-400">
            ${product.price}
          </span>
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
            -30%
          </span> */}
        </div>

        <div>
          <p className="text-gray-600">
            {product.stock_quantity > 0
              ? `In stock: ${product.stock_quantity}`
              : "Out of stock"}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Delivery</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Free standard shipping on orders over $35</li>
            <li>• Standard delivery (2-5 days): $4.00</li>
            <li>• Express delivery (1-2 days): $10.00</li>
            <li>• Ships from: USA Warehouse</li>
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Returns</h2>
          <p className="text-sm text-gray-600">
            Free return within 30 days for items in their original condition.
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button className="flex gap-2 items-center">
            <ShoppingCart className="w-4 h-4" /> Add to cart
          </Button>
          <Button variant="outline" className="flex gap-2 items-center">
            <Heart className="w-4 h-4" /> Favorite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
