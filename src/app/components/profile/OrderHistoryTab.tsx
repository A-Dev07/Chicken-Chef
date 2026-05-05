import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { OrderDetailModal } from "./OrderDetailModal";

export function OrderHistoryTab() {
  const { orders } = useUser();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "confirmed":
      case "preparing":
        return <Package className="w-5 h-5 text-blue-500" />;
      case "out-for-delivery":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6">
        <h2 className="text-2xl mb-6">Order History</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-[#aa5289] transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="text-lg">#{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`text-sm ${
                        order.status === "delivered"
                          ? "text-green-600"
                          : order.status === "cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mb-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <ImageWithFallback
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {formatDate(order.date)}
                  </span>
                  <span className="text-[#aa5289]">₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
