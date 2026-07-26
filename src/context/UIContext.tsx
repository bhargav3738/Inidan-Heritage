import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AuthMode = "login" | "signup";

interface UIContextValue {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  authMode: AuthMode | null;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  toggleAuthMode: () => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Every callback below is wrapped in useCallback with an empty dep list so its
  // identity is stable for the life of the provider. Consumers list these in
  // effect deps (useFocusTrap keeps `onClose` in its deps); if they were inline
  // arrows recreated whenever `toast` changed, an unrelated toast would tear
  // down and re-run those effects — which stole focus out of the open cart.
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openAuth = useCallback((mode: AuthMode) => setAuthMode(mode), []);
  const closeAuth = useCallback(() => setAuthMode(null), []);
  const toggleAuthMode = useCallback(
    () => setAuthMode((m) => (m === "login" ? "signup" : "login")),
    [],
  );
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((o) => !o), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      authMode,
      openAuth,
      closeAuth,
      toggleAuthMode,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toast,
      showToast,
    }),
    [
      cartOpen,
      openCart,
      closeCart,
      authMode,
      openAuth,
      closeAuth,
      toggleAuthMode,
      mobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      toast,
      showToast,
    ],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
