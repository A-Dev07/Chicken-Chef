import { Link } from "react-router";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function OrderConfirmationPage() {
  const { cartItems, getTotal, clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<"pending" | "confirmed" | "preparing" | "delivering">("pending");
  const orderId = `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const deliveryFee = 49;
  const tax = getTotal() * 0.05;
  const total = getTotal() + deliveryFee + tax;

  useEffect(() => {
    // Simulate order status updates
    const timer1 = setTimeout(() => setOrderStatus("confirmed"), 2000);
    const timer2 = setTimeout(() => setOrderStatus("preparing"), 5000);
    const timer3 = setTimeout(() => setOrderStatus("delivering"), 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const getStatusMessage = () => {
    switch (orderStatus) {
      case "pending":
        return "Processing your order...";
      case "confirmed":
        return "Order confirmed!";
      case "preparing":
        return "Your food is being prepared";
      case "delivering":
        return "Out for delivery";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#aa5289] rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🍗</span>
            </div>
            <span className="text-xl text-[#aa5289]">Chicken Chef</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll deliver it soon.
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-lg">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="text-lg">30-40 mins</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#aa5289] to-[#2d5016] text-white p-4 rounded-xl flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <p className="text-sm opacity-90">Status</p>
              <p className="text-lg">{getStatusMessage()}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl mb-4">Order Details</h2>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#aa5289]">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-[#aa5289]">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl mb-4">Delivery Information</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#aa5289] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p>123 College Street, Apt 4B, City, State 12345</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#aa5289] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Contact Number</p>
                <p>(555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            onClick={clearCart}
            className="flex-1 bg-[#aa5289] hover:bg-[#923d71] text-white py-3 rounded-xl text-center transition-colors"
          >
            Order More Food
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-center border border-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}