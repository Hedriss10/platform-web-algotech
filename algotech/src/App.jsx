import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/Routes';
import Aside from './module/components/Aside';
import Header from './module/components/Header';
import Footer from './module/components/Footer';
import { UserProvider } from './service/UserContext';
import './App.css';

function App() {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const location = useLocation();

  const toggleAside = () => {
    setIsAsideOpen(!isAsideOpen);
  };
  const isLoginPage = location.pathname === '/';

  return (
    <UserProvider>
      {!isLoginPage && <Header toggleAside={toggleAside} />}
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-2">
          {!isLoginPage && <Aside isOpen={isAsideOpen} setIsOpen={setIsAsideOpen} />}
          <main
            className={`flex-12 p-4 transition-margin duration-300 ease-in-out ${
              isAsideOpen ? 'ml-64' : 'ml-0'
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