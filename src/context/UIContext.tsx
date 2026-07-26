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

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      authMode,
      openAuth: (mode: AuthMode) => setAuthMode(mode),
      closeAuth: () => setAuthMode(null),
      toggleAuthMode: () =>
        setAuthMode((m) => (m === "login" ? "signup" : "login")),
      mobileMenuOpen,
      toggleMobileMenu: () => setMobileMenuOpen((o) => !o),
      closeMobileMenu: () => setMobileMenuOpen(false),
      toast,
      showToast,
    }),
    [cartOpen, authMode, mobileMenuOpen, toast, showToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
