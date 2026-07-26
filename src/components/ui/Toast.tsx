import { useState } from "react";
import { useUI } from "../../context/UIContext";

export function Toast() {
  const { toast } = useUI();

  // The original only ever toggles classes on the pill and never rewrites
  // #toast-message (legacy/index.html:1792-1799), so the text stays on screen
  // for the whole 300ms slide-out. Rendering `toast` directly would blank the
  // pill on the same commit the exit starts. Adjusting state during render (the
  // sanctioned pattern) keeps the last message without an extra commit.
  const [shown, setShown] = useState<string | null>(null);
  if (toast !== null && toast !== shown) setShown(toast);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] transition-all duration-300 pointer-events-none ${
        toast ? "" : "translate-y-24 opacity-0"
      }`}
    >
      <div
        className="rounded-full px-5 py-3 text-sm font-medium text-surface shadow-lg"
        style={{ background: "#231008" }}
      >
        <span>{shown}</span>
      </div>
    </div>
  );
}
