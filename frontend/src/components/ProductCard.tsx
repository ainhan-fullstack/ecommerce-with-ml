import { Card, CardContent } from "./ui/card";
import type { Product } from "@/types/products";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition duration-200">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
      <CardContent className="space-y-2 p-4">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          <Link to={`/product/${product.id}`} className="cursor-pointer">
            {product.name}
          </Link>
        </h3>
        <div className="text-primary font-bold text-lg">${product.price}</div>
        <div className="flex items-center space-x-1 text-yellow-500">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={`rating ${i}`}
              className={`h4 w-4 ${
                i < Math.round(product.rating)
                  ? "fill-yellow-500"
                  : "fill-white-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            ({product.rating})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
