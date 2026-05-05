import { X } from "lucide-react";
import { FoodItem } from "../context/CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FoodDetailModalProps {
  item: FoodItem;
  onClose: () => void;
}

export function FoodDetailModal({ item, onClose }: FoodDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl">{item.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />

          {/* Price and Category */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl text-[#aa5289] mb-1">₹{item.price}</p>
              <p className="text-gray-600">Category: {item.category}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm ${
                (item as any).type === "veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {(item as any).type === "veg" ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
            </span>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-xl mb-3">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(item as any).ingredients?.map((ingredient: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#aa5289] mt-1">•</span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recipe */}
          <div className="mb-4">
            <h3 className="text-xl mb-3">Recipe & Preparation</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {(item as any).recipe}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
