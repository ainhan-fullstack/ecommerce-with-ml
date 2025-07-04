import { Button } from "@/components/ui/button";
import type { ProductDetails } from "@/types/products";
import api from "@/utils/axios";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleQuantityIncrease = () => {
    setQuantity((prev) =>
      product && product.stock_quantity ? prev + 1 : prev
    );
  };

  const handleQuantityDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data[0]))
      .catch((err: any) => alert(err.response?.data[0]?.message));
  }, [id]);

  if (!product) return <div>404 not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md">
          <img
            src={product.images[currentImageIndex] || product.image_url}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          <button
            type="button"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            aria-label="Previous image"
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? product.images.length - 1 : prev - 1
              )
            }
          >
            &#8592;
          </button>
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === product.images.length - 1 ? 0 : prev + 1
              )
            }
            aria-label="Next image"
          >
            &#8594;
          </button>
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
        <div>
          <form>
            <label
              htmlFor="quantity-input"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Choose quantity:
            </label>
            <div className="relative flex items-center max-w-[8rem]">
              <button
                type="button"
                id="decrement-button"
                disabled={quantity === 1}
                onClick={handleQuantityDecrease}
                data-input-counter-decrement="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <input
                type="text"
                id="quantity-input"
                data-input-counter
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 border-x-0 border-gray-300 h-11 text-black text-center text-sm front-bold focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"
                value={quantity}
                min={1}
                max={product.stock_quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= product.stock_quantity)
                    setQuantity(val);
                }}
                // disabled={true}
                required
              />
              <button
                type="button"
                id="increment-button"
                disabled={quantity === product.stock_quantity}
                onClick={handleQuantityIncrease}
                data-input-counter-increment="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <div className="flex gap-4 mt-10">
          <Button className="flex gap-2 items-center cursor-pointer hover:bg-red-600">
            <ShoppingCart className="w-4 h-4" /> Add to cart
          </Button>
          <Button
            variant="secondary"
            className="flex gap-2 items-center cursor-pointer bg-black text-white hover:bg-red-600"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="flex gap-2 items-center cursor-pointer"
          >
            <Heart className="w-4 h-4" /> Favorite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
