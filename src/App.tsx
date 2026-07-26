import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <main id="main-view" />
        <Toast />
      </CartProvider>
    </UIProvider>
  );
}
