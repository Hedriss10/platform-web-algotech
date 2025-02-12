import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import Aside from "./module/components/Aside";
import Header from "./module/components/Header";
import Footer from "./module/components/Footer";
import "./App.css";

function App() {
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };

  return (
    <Router>
      <Header toggleAside={toggleAside} />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <Aside isOpen={isAsideOpen} />
          <main
            className={`flex-1 p-4 transition-margin duration-300 ease-in-out ${
              isAsideOpen ? "ml-64" : "ml-0"
            }`}
          >
            <AppRoutes />
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
