import { X } from "lucide-react";
import { Order } from "../../context/UserContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Clock, Package, Truck, CheckCircle, XCircle, MapPin } from "lucide-react";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "confirmed":
      case "preparing":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "out-for-delivery":
        return <Truck className="w-6 h-6 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "out-for-delivery":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 49;
  const tax = subtotal * 0.05;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Order Details</h2>
            <p className="text-sm text-gray-600">Order #{order.id}</p>
          </div>
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
          {/* Status */}
          <div className="mb-6">
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${getStatusColor(
                order.status
              )}`}
            >
              {getStatusIcon(order.status)}
              <div>
                <p className="text-sm opacity-75">Order Status</p>
                <p className="text-lg">{getStatusText(order.status)}</p>
              </div>
            </div>
          </div>

          {/* Order Date */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Date & Time</p>
            <p className="text-lg">{formatDate(order.date)}</p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-3 border-b last:border-b-0"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-1">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#aa5289]">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg mb-3">Price Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-lg">
                  <span>Total Amount</span>
                  <span className="text-[#aa5289]">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h3 className="text-lg mb-3">Delivery Address</h3>
            <div className="flex gap-3 bg-gray-50 rounded-xl p-4">
              <MapPin className="w-5 h-5 text-[#aa5289] mt-0.5" />
              <p className="text-gray-700">{order.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
