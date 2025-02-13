import React, { useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/Routes";
import Aside from "./module/components/Aside";
import Header from "./module/components/Header";
import Footer from "./module/components/Footer";
import { UserProvider } from "./service/UserContext";
import "./App.css";

function App() {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const location = useLocation(); // Obtém a rota atual

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  // Verifica se a página atual é a de login
  const isLoginPage = location.pathname === "/";

  return (
    <UserProvider>
      {/* Renderiza o layout completo apenas se NÃO estiver na página de login */}
      {!isLoginPage && <Header toggleAside={toggleAside} />}

      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          {!isLoginPage && <Aside isOpen={isAsideOpen} />}
          <main
            className={`flex-1 p-4 transition-margin duration-300 ease-in-out ${
              isAsideOpen ? "ml-64" : "ml-0"
            }`}
          >
            <AppRoutes />
          </main>
        </div>
        {!isLoginPage && <Footer />}
        <ToastContainer />
      </div>
    </UserProvider>
  );
}

export default App;
