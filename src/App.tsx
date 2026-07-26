import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/layout/Navbar";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <Navbar />
        <main id="main-view" />
        <Toast />
      </CartProvider>
    </UIProvider>
  );
}
