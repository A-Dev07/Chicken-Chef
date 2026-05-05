import { Plus } from "lucide-react";
import { FoodItem, useCart } from "../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FoodCardProps {
  item: FoodItem;
  circular?: boolean;
  onClick?: () => void;
}

export function FoodCard({ item, circular = false, onClick }: FoodCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative mb-3">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className={`w-full h-40 object-cover ${
            circular ? "rounded-full" : "rounded-xl"
          }`}
        />
        {/* Veg/Non-veg indicator */}
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs">
          {(item as any).type === "veg" ? "🟢" : "🔴"}
        </div>
      </div>
      <h3 className="mb-1">{item.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{item.category}</p>
      <div className="flex items-center justify-between">
        <span className="text-[#aa5289]">₹{item.price}</span>
        <button
          onClick={handleAddToCart}
          className="bg-[#aa5289] text-white p-2 rounded-full hover:bg-[#923d71] transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}