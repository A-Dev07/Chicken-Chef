import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Settings,
  ShoppingBag,
  Heart,
  ArrowLeft,
  Camera,
  LogOut,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { OrderHistoryTab } from "../components/profile/OrderHistoryTab";
import { AddressesTab } from "../components/profile/AddressesTab";
import { SettingsTab } from "../components/profile/SettingsTab";
import { FavoritesTab } from "../components/profile/FavoritesTab";

export function ProfilePage() {
  const { user, logout, isLoading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "orders" | "addresses" | "favorites" | "settings"
  >("orders");

  // Redirect to login if not authenticated (after loading finishes)
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const tabs = [
    { id: "orders" as const, label: "Order History", icon: ShoppingBag },
    { id: "addresses" as const, label: "Addresses", icon: MapPin },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  // Show loading spinner while session is being verified
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#aa5289] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback avatar: use UI Avatars service (no profileImage field in AuthUser)
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=aa5289&color=fff&size=128`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-[#aa5289]"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl">My Profile</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex">
        {/* Fixed Sidebar - Profile Info */}
        <div className="hidden lg:block lg:w-80 fixed left-0 top-20 h-[calc(100vh-80px)] overflow-y-auto bg-gray-50 border-r border-gray-200 p-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  className="absolute bottom-0 right-0 bg-[#aa5289] text-white p-2 rounded-full hover:bg-[#923d71] transition-colors"
                  aria-label="Change profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl mb-1">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#aa5289]/10 text-[#aa5289]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-4 border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-80 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === "orders" && <OrderHistoryTab />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "favorites" && <FavoritesTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
