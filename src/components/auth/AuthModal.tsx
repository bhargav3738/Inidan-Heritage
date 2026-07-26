import { useEffect, useRef, type FormEvent } from "react";
import { useUI } from "../../context/UIContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Icon } from "../ui/Icon";

const FIELD_CLASS =
  "w-full rounded-xl px-4 py-3 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-heritage/40 focus:border-heritage";
const LABEL_CLASS =
  "block text-xs font-medium uppercase tracking-widest text-stone-500 mb-1.5";

export function AuthModal() {
  const { authMode, closeAuth, toggleAuthMode, showToast } = useUI();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const isOpen = authMode !== null;
  const isLogin = authMode === "login";

  useBodyScrollLock(isOpen);
  useFocusTrap(containerRef, isOpen, closeAuth);

  useEffect(() => {
    if (isOpen) emailRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = isLogin ? "Signed in. (demo)" : "Account created. (demo)";
    closeAuth();
    showToast(message);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[70] overflow-y-auto bg-surface"
      role="dialog"
      aria-modal="true"
      aria-label="Login or sign up"
    >
      <div className="min-h-full grid lg:grid-cols-2">
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d3?q=80&w=1600&auto=format&fit=crop"
            alt="Tandoori skewers grilling over open flame"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24, 10, 6, 0.85), rgba(24, 10, 6, 0.25))",
            }}
          />
          <div className="absolute bottom-0 p-12 text-surface">
            <span className="flex items-center gap-2.5 mb-5">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #8b3a2e, #5e2318)",
                }}
              >
                <Icon icon="solar:fire-linear" width={18} />
              </span>
              <span
                className="brand-lockup text-lg tracking-tight font-display font-semibold"
              >
                Bombay Heritage
              </span>
            </span>
            <p
              className="text-3xl tracking-tight leading-snug max-w-md font-display font-medium"
            >
              &quot;A meal shared is a memory made. Come make one with us.&quot;
            </p>
            <p className="mt-3 text-sm text-stone-300">
              — Chef Meera Kapoor, Head of Kitchen
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center px-4 sm:px-8 py-12">
          <div className="w-full max-w-md">
            <button
              onClick={closeAuth}
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-heritage transition-colors"
            >
              <Icon icon="solar:arrow-left-linear" width={16} />
              Back to site
            </button>
            <h1
              className="text-3xl tracking-tight text-cacao font-display font-medium"
            >
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              {isLogin
                ? "Sign in to track your orders and save your favourites."
                : "Join us for faster checkout and seasonal specials."}
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="auth-name" className={LABEL_CLASS}>
                    Full name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="Jane Doe"
                    className={FIELD_CLASS}
                  />
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  ref={emailRef}
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className={FIELD_CLASS}
                />
              </div>
              <div>
                <label htmlFor="auth-password" className={LABEL_CLASS}>
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className={FIELD_CLASS}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full py-3.5 text-sm font-semibold text-surface transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #8b3a2e, #5e2318)",
                }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>{" "}
              <button
                onClick={toggleAuthMode}
                className="font-semibold text-heritage hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
