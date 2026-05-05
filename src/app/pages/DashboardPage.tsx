import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import {
  Home, UtensilsCrossed, ShoppingBag, User,
  ShoppingCart, Search, LogOut, Menu, X,
} from 'lucide-react';
import { FoodCard } from '../components/FoodCard';
import { foodItems } from '../data/foodItems';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { FoodDetailModal } from '../components/FoodDetailModal';

const CATEGORIES = ['All', 'Veg', 'Non-Veg', 'Italian', 'Chinese', 'Snacks', 'Beverages', 'Desserts'];

export function DashboardPage() {
  const { cartItems }            = useCart();
  const { user, logout }         = useUser();
  const navigate                 = useNavigate();
  const [category, setCategory]  = useState('All');
  const [search,   setSearch]    = useState('');
  const [selected, setSelected]  = useState<any>(null);
  const [sideOpen, setSideOpen]  = useState(false);   // mobile sidebar

  const filtered = foodItems.filter(item => {
    const matchCat    = category === 'All' || item.category === category;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ── Sidebar content (shared between desktop + mobile drawer) ──
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 shrink-0 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setSideOpen(false)}>
          <div className="w-10 h-10 bg-[#aa5289] rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🍗</span>
          </div>
          <span className="text-xl text-[#aa5289]">Chicken Chef</span>
        </Link>
        {/* Close button – only shown in mobile drawer */}
        <button
          onClick={() => setSideOpen(false)}
          className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-2">
          {[
            { to: '/dashboard', icon: Home,           label: 'Home',    active: true },
            { to: '/dashboard', icon: UtensilsCrossed, label: 'Menu',   active: false },
            { to: '/cart',      icon: ShoppingBag,    label: 'Orders',  active: false },
            { to: '/profile',   icon: User,           label: 'Profile', active: false },
          ].map(({ to, icon: Icon, label, active }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active
                    ? 'bg-[#aa5289]/10 text-[#aa5289]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg hidden lg:flex lg:flex-col border-r border-gray-200 h-screen">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ──────────────────────── */}
      {sideOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ───────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${sideOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* ── Main Content ────────────────────────────────── */}
      <div className="flex flex-col lg:ml-64 w-full min-h-screen bg-gray-50">

        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-4 shrink-0 z-20 border-b border-gray-100 sticky top-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Hamburger – mobile only */}
              <button
                onClick={() => setSideOpen(true)}
                className="lg:hidden p-2 text-gray-700 hover:text-[#aa5289] -ml-1 shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl truncate">
                  {greeting()}, {user?.name?.split(' ')[0] ?? 'there'}!
                </h1>
                <p className="text-gray-600 text-sm hidden sm:block">What would you like to eat today?</p>
              </div>
            </div>

            <Link
              to="/cart"
              className="relative bg-[#aa5289] hover:bg-[#923d71] text-white p-2.5 sm:p-3 rounded-xl transition-colors shrink-0"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#2d5016] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {/* Search */}
          <div className="mb-5">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for dishes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent bg-white"
              />
            </div>
          </div>

          {/* Categories – horizontal scroll on mobile */}
          <div className="mb-5 -mx-4 sm:mx-0">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 px-4 sm:px-0 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-full whitespace-nowrap transition-colors text-sm sm:text-base shrink-0 ${
                    category === cat
                      ? 'bg-[#aa5289] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div>
            <h2 className="text-lg sm:text-xl mb-4">
              {category === 'All' ? 'All Dishes' : `${category} Dishes`}
            </h2>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filtered.map(item => (
                  <FoodCard
                    key={item.id}
                    item={item}
                    onClick={() => setSelected(item)}
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
      {selected && (
        <FoodDetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
