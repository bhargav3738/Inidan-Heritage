import { useUI } from "../../context/UIContext";

export function Toast() {
  const { toast } = useUI();
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
        <span>{toast}</span>
      </div>
    </div>
  );
}
