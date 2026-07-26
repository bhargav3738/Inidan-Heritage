import { UIProvider } from "./context/UIContext";
import { Toast } from "./components/ui/Toast";

export default function App() {
  return (
    <UIProvider>
      <main id="main-view" />
      <Toast />
    </UIProvider>
  );
}
