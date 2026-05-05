import {
  createContext, useContext, useState, useEffect, ReactNode, useCallback,
} from 'react';
import { authApi, AuthUser } from '../utils/api';

// ── Types ──────────────────────────────────────────────────
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
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  address: string;
}

interface UserContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  addresses: Address[];
  orders: Order[];
  favorites: string[];
  // Auth
  login:  (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Local helpers (kept local – extend to backend as needed)
  updateUser:        (u: Partial<{ name: string; email: string; phone: string }>) => void;
  addAddress:        (a: Omit<Address, 'id'>) => void;
  updateAddress:     (id: string, a: Partial<Address>) => void;
  deleteAddress:     (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addToFavorites:    (itemId: string) => void;
  removeFromFavorites:(itemId: string) => void;
  isFavorite:        (itemId: string) => boolean;
  addOrder:          (o: Omit<Order, 'id' | 'date'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // On mount – check if a session cookie is already alive.
  // If the backend is unreachable or the user is not logged in,
  // we simply set user = null and stop loading (no crash).
  useEffect(() => {
    authApi.me()
      .then((u) => setUser(u))
      .catch(() => {
        // Expected: 401 Unauthorized (not logged in) or backend unavailable.
        // Either way, treat as "not logged in".
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Auth actions ─────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const u = await authApi.login(email, password);
    setUser(u);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const u = await authApi.signup(name, email, password);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
    setOrders([]);
    setFavorites([]);
  }, []);

  // ── Local helpers ─────────────────────────────────────────
  const updateUser = (updates: Partial<{ name: string; email: string; phone: string }>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  };

  const addAddress = (address: Omit<Address, 'id'>) =>
    setAddresses(prev => [...prev, { ...address, id: Date.now().toString() }]);

  const updateAddress = (id: string, updates: Partial<Address>) =>
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

  const deleteAddress = (id: string) =>
    setAddresses(prev => prev.filter(a => a.id !== id));

  const setDefaultAddress = (id: string) =>
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

  const addToFavorites    = (id: string) => setFavorites(p => [...p, id]);
  const removeFromFavorites = (id: string) => setFavorites(p => p.filter(f => f !== id));
  const isFavorite        = (id: string) => favorites.includes(id);

  const addOrder = (order: Omit<Order, 'id' | 'date'>) =>
    setOrders(prev => [{
      ...order,
      id: `ORD${(prev.length + 1).toString().padStart(3, '0')}`,
      date: new Date(),
    }, ...prev]);

  return (
    <UserContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      addresses,
      orders,
      favorites,
      login, signup, logout,
      updateUser,
      addAddress, updateAddress, deleteAddress, setDefaultAddress,
      addToFavorites, removeFromFavorites, isFavorite,
      addOrder,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
