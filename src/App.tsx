import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { Specials } from "./components/sections/Specials";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <Navbar />
        <main id="main-view">
          <Hero />
          <Specials />
        </main>
        <Toast />
      </CartProvider>
    </UIProvider>
  );
}
