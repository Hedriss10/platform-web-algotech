import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import "./index.css";
import App from "./App.tsx";

// Confirma na consola (F12) se este entry está a correr — não aparece se estiveres noutro projeto/porta.
console.info("[platform-web-algotech] main.tsx carregado");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
