import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import scrollFX from "./lib/scrollFX";

// Suppress browser extension messaging errors from Firebase auth iframe
window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason && (event.reason.message || event.reason);
  if (typeof msg === 'string' && msg.includes('A listener indicated an asynchronous response by returning true')) {
    event.preventDefault();
    console.warn('Suppressed extension messaging error');
  }
});

// Initialize scroll animations after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  scrollFX.init();
});

createRoot(document.getElementById("root")!).render(<App />);
