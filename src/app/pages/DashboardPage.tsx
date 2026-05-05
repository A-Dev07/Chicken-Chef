import { Link } from "react-router";
import { useState } from "react";
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  User,
  ShoppingCart,
  Search,
  LogOut,
} from "lucide-react";
import { FoodCard } from "../components/FoodCard";
import { foodItems } from "../data/foodItems";
import { useCart } from "../context/CartContext";
import { FoodDetailModal } from "../components/FoodDetailModal";

export function DashboardPage() {
  const { cartItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<any>(null);

  const categories = [
    "All",
    "Veg",
    "Non-Veg",
    "Italian",
    "Chinese",
    "Snacks",
    "Beverages",
    "Desserts",
  ];

  const filteredItems = foodItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg hidden lg:flex lg:flex-col border-r border-gray-200 h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#aa5289] rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🍗</span>
            </div>
            <span className="text-xl text-[#aa5289]">Chicken Chef</span>
          </Link>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#aa5289]/10 text-[#aa5289]"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <ShoppingBag className="w-5 h-5" />
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Fixed Logout */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col lg:ml-64 w-full min-h-screen bg-gray-50">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 shrink-0 z-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl">{getGreeting()}, User!</h1>
              <p className="text-gray-600">What would you like to eat today?</p>
            </div>
            <Link
              to="/cart"
              className="relative bg-[#aa5289] hover:bg-[#923d71] text-white p-3 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2d5016] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-[#aa5289] text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Food Items Grid */}
          <div>
            <h2 className="text-xl mb-4">
              {selectedCategory === "All"
                ? "All Dishes"
                : `${selectedCategory} Dishes`}
            </h2>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedFood(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No dishes found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          item={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </>
  );
}

