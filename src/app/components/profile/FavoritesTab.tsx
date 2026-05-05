import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { foodItems } from "../../data/foodItems";
import { FoodCard } from "../FoodCard";
import { Heart } from "lucide-react";
import { FoodDetailModal } from "../FoodDetailModal";

export function FavoritesTab() {
  const { favorites } = useUser();
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const favoriteFoodItems = foodItems.filter((item) =>
    favorites.includes(item.id)
  );

  return (
    <>
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl mb-6">My Favorites</h2>

        {favoriteFoodItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No favorite items yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Start adding items to your favorites from the menu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteFoodItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onClick={() => setSelectedFood(item)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedFood && (
        <FoodDetailModal
          item={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </>
  );
}
