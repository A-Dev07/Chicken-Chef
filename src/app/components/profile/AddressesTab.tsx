import { useState } from "react";
import { useUser, Address } from "../../context/UserContext";
import { Plus, Edit2, Trash2, MapPin, Star } from "lucide-react";
import { AddressFormModal } from "./AddressFormModal";

export function AddressesTab() {
  const { addresses, deleteAddress, setDefaultAddress } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress(id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Saved Addresses</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-[#aa5289] hover:bg-[#923d71] text-white px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No saved addresses</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[#aa5289] hover:underline"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-xl p-4 relative ${
                  address.isDefault
                    ? "border-[#aa5289] bg-[#aa5289]/5"
                    : "border-gray-200"
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-2 right-2">
                    <span className="flex items-center gap-1 bg-[#aa5289] text-white text-xs px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                      Default
                    </span>
                  </div>
                )}

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-[#aa5289]" />
                    <h3 className="text-lg">{address.label}</h3>
                  </div>
                  <p className="text-gray-700 mb-1">{address.fullAddress}</p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-[#aa5289] hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="ml-auto text-gray-600 hover:text-[#aa5289] p-2"
                    aria-label="Edit address"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-gray-600 hover:text-red-600 p-2"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showAddForm || editingAddress) && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
        />
      )}
    </>
  );
}
