import { createContext, useContext, useState, ReactNode } from "react";

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number; image: string }>;
  total: number;
  date: Date;
  status: "pending" | "confirmed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  address: string;
}

interface UserContextType {
  user: {
    name: string;
    email: string;
    phone: string;
    profileImage: string;
  };
  isLoggedIn: boolean;
  addresses: Address[];
  orders: Order[];
  favorites: string[];
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addToFavorites: (itemId: string) => void;
  removeFromFavorites: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  addOrder: (order: Omit<Order, "id" | "date">) => void;
  updateUser: (user: Partial<{ name: string; email: string; phone: string }>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      fullAddress: "123 College Street, Apt 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "+91 98765 43210",
      isDefault: true,
    },
    {
      id: "2",
      label: "Hostel",
      fullAddress: "Room 205, University Hostel Block A",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400098",
      phone: "+91 98765 43210",
      isDefault: false,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD001",
      items: [
        {
          id: "1",
          name: "Chicken Biryani",
          quantity: 2,
          price: 299,
          image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBiaXJ5YW5pJTIwcmljZXxlbnwxfHx8fDE3NzUwMzIzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        },
        {
          id: "5",
          name: "French Fries",
          quantity: 1,
          price: 99,
          image: "https://images.unsplash.com/photo-1599211469310-9b0b50a2955a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllcyUyMGNyaXNweXxlbnwxfHx8fDE3NzUwMTE4MzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        },
      ],
      total: 746,
      date: new Date("2026-03-30T14:30:00"),
      status: "delivered",
      address: "123 College Street, Apt 4B, Mumbai",
    },
    {
      id: "ORD002",
      items: [
        {
          id: "3",
          name: "Butter Chicken",
          quantity: 1,
          price: 329,
          image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0ZXIlMjBjaGlja2VuJTIwY3Vycnl8ZW58MXx8fHwxNzc1MDE5MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        },
      ],
      total: 427,
      date: new Date("2026-04-01T19:15:00"),
      status: "out-for-delivery",
      address: "Room 205, University Hostel Block A, Mumbai",
    },
  ]);

  const [favorites, setFavorites] = useState<string[]>(["1", "3", "6"]);

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };
    setAddresses((prev) => [...prev, newAddress]);
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const addToFavorites = (itemId: string) => {
    setFavorites((prev) => [...prev, itemId]);
  };

  const removeFromFavorites = (itemId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== itemId));
  };

  const isFavorite = (itemId: string) => {
    return favorites.includes(itemId);
  };

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD${(orders.length + 1).toString().padStart(3, "0")}`,
      date: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateUser = (updates: Partial<{ name: string; email: string; phone: string }>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        addresses,
        orders,
        favorites,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addOrder,
        updateUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
