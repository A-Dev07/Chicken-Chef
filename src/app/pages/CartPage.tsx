import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Loader2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { orderApi } from '../utils/api';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CartPage() {
  const navigate                     = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { isLoggedIn, addresses }    = useUser();
  const [address, setAddress]        = useState('');
  const [loading, setLoading]        = useState(false);
  const [apiError, setApiError]      = useState('');

  const deliveryFee = 49;
  const tax         = getTotal() * 0.05;
  const total       = getTotal() + deliveryFee + tax;

  const handleCheckout = async () => {
    if (!cartItems.length) return;
    setApiError('');

    // If not logged in, redirect to login
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await orderApi.create({
        items: cartItems.map(i => ({
          id: i.id, name: i.name, price: i.price, quantity: i.quantity,
        })),
        address: address || (addresses[0]?.fullAddress ?? ''),
        total,
      });
      clearCart();
      navigate('/order-confirmation');
    } catch (err: any) {
      setApiError(err.message ?? 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-[#aa5289]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl sm:text-2xl">Your Cart</h1>
          {cartItems.length > 0 && (
            <span className="ml-auto text-sm text-gray-500">
              {cartItems.length} item{cartItems.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 sm:p-12 text-center">
            <ShoppingBag className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl sm:text-2xl mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious dishes to get started</p>
            <Link
              to="/dashboard"
              className="inline-block bg-[#aa5289] hover:bg-[#923d71] text-white px-6 sm:px-8 py-3 rounded-xl transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* ── Cart Items ─────────────────────────────── */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4 items-start">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-0.5 truncate text-sm sm:text-base">{item.name}</h3>
                    <p className="text-[#aa5289] text-sm sm:text-base mb-2">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#aa5289] hover:text-[#aa5289] transition-colors"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <span className="w-6 text-center text-sm sm:text-base">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#aa5289] hover:text-[#aa5289] transition-colors"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <p className="text-sm sm:text-base font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ──────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span>₹{getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-[#aa5289]">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery address textarea */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter your delivery address…"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent resize-none"
                  />
                </div>

                {apiError && (
                  <p className="text-red-600 text-sm mb-3">{apiError}</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || cartItems.length === 0}
                  className="w-full bg-[#aa5289] hover:bg-[#923d71] disabled:opacity-60 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Placing order…' : 'Proceed to Checkout'}
                </button>

                <Link
                  to="/dashboard"
                  className="block text-center mt-4 text-gray-600 hover:text-[#aa5289] text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
