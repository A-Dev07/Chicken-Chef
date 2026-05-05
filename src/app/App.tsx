import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </UserProvider>
  );
}