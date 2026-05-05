import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser, Address } from "../../context/UserContext";

interface AddressFormModalProps {
  address: Address | null;
  onClose: () => void;
}

export function AddressFormModal({ address, onClose }: AddressFormModalProps) {
  const { addAddress, updateAddress } = useUser();
  const [formData, setFormData] = useState({
    label: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        fullAddress: address.fullAddress,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: address.phone,
        isDefault: address.isDefault,
      });
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      updateAddress(address.id, formData);
    } else {
      addAddress(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm mb-2 text-gray-700">
                Address Label *
              </label>
              <input
                type="text"
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="Home, Office, Hostel, etc."
                required
              />
            </div>

            <div>
              <label
                htmlFor="fullAddress"
                className="block text-sm mb-2 text-gray-700"
              >
                Full Address *
              </label>
              <textarea
                id="fullAddress"
                value={formData.fullAddress}
                onChange={(e) =>
                  setFormData({ ...formData, fullAddress: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                placeholder="House/Flat No., Building, Street, Area"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm mb-2 text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                  placeholder="Mumbai"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm mb-2 text-gray-700">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                  placeholder="Maharashtra"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm mb-2 text-gray-700"
                >
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                  placeholder="400001"
                  required
                  pattern="[0-9]{6}"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm mb-2 text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aa5289] focus:border-transparent"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-4 h-4 text-[#aa5289] border-gray-300 rounded focus:ring-[#aa5289]"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#aa5289] hover:bg-[#923d71] text-white py-3 rounded-xl transition-colors"
            >
              {address ? "Update Address" : "Add Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
