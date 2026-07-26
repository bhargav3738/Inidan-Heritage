import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { Specials } from "./components/sections/Specials";
import { Menu } from "./components/sections/Menu";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <CartProvider>
        <Navbar />
        <main id="main-view">
          <Hero />
          <Specials />
          <Menu />
          <About />
          <Contact />
        </main>
        <Toast />
      </CartProvider>
    </UIProvider>
  );
}
