import { Link } from "react-router";
import { ShoppingCart, User, Search } from "lucide-react";
import { FoodCard } from "../components/FoodCard";
import { foodItems } from "../data/foodItems";
import { useCart } from "../context/CartContext";
import heroImage from "../../imports/image.png";
import { useState } from "react";
import { FoodDetailModal } from "../components/FoodDetailModal";

export function LandingPage() {
  const { cartItems } = useCart();
  const featuredItems = foodItems.slice(0, 6);
  const [selectedFood, setSelectedFood] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#aa5289] rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🍗</span>
              </div>
              <span className="text-xl text-[#aa5289]">Chicken Chef</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-[#aa5289]">
                Home
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-[#aa5289]"
              >
                Menu
              </Link>
              <Link to="/#about" className="text-gray-700 hover:text-[#aa5289]">
                About
              </Link>
              <Link
                to="/#contact"
                className="text-gray-700 hover:text-[#aa5289]"
              >
                Contact
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative text-gray-700 hover:text-[#aa5289]">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#aa5289] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-[#aa5289]"
              >
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#2d5016] text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <img
            src={heroImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6">
              Order food anytime, anywhere
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Delicious chicken dishes delivered fresh to your doorstep. Perfect
              for students and food lovers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="bg-[#aa5289] hover:bg-[#923d71] text-white px-8 py-3 rounded-full transition-colors"
              >
                Order Now
              </Link>
              <Link
                to="/dashboard"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-full transition-colors border border-white/20"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Featured Dishes</h2>
            <p className="text-gray-600">
              Try our most popular chicken dishes loved by students
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                circular
                onClick={() => setSelectedFood(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#aa5289]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered within 30 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2d5016]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍗</span>
              </div>
              <h3 className="text-xl mb-2">Fresh & Quality</h3>
              <p className="text-gray-600">
                Made with the freshest ingredients daily
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#aa5289]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl mb-2">Student Friendly</h3>
              <p className="text-gray-600">
                Affordable prices perfect for student budgets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#aa5289] rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🍗</span>
                </div>
                <span className="text-xl text-[#aa5289]">Chicken Chef</span>
              </div>
              <p className="text-gray-400">
                Delicious chicken dishes delivered fresh to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-gray-400 hover:text-white">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-gray-400 hover:text-white">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 contact@chickenchef.com</li>
                <li>📞 (555) 123-4567</li>
                <li>📍 123 Food Street, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Chicken Chef. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Food Detail Modal */}
      {selectedFood && (
        <FoodDetailModal
          item={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </div>
  );
}