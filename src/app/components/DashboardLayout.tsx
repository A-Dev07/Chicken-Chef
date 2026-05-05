import { Link, Outlet, useLocation } from "react-router";
import { Home, Menu, ShoppingCart, Package, User, ChefHat, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";

export function DashboardLayout() {
  const location = useLocation();
  const { cartItems } = useCart();
  const totalItems = cartItems.length || 0;

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/dashboard/menu", icon: Menu, label: "Menu" },
    { path: "/dashboard/cart", icon: ShoppingCart, label: "Cart", badge: totalItems },
    { path: "/dashboard/orders", icon: Package, label: "Orders" },
    { path: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="w-8 h-8" style={{ color: "#aa5289" }} />
            <span className="text-xl" style={{ color: "#aa5289" }}>Chicken Chef</span>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors relative ${
                      active
                        ? "text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    style={active ? { backgroundColor: "#aa5289" } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className="ml-auto text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: "#2d5f3f" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Fixed Logout at Bottom */}
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

      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </>
  );
}

