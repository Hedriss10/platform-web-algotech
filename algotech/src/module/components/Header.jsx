import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";
import { useUser } from "../../service/UserContext";

const Header = ({ toggleAside }) => {
  const { user } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow fixed w-full top-0 z-10 flex items-center justify-between p-4">
      {/* Ícone do menu hamburguer e logo */}
      <div className="flex items-center">
        <button onClick={toggleAside} className="text-white focus:outline-none">
          <Icons.BiListUl className="h-6 w-6 cursor-pointer" />
        </button>
        <Link to="/" className="flex items-center ml-4">
          <span className="text-xl font-semibold hidden lg:block">maisbs</span>
        </Link>
      </div>

      <nav className="flex items-center space-x-6">
        <div className="relative">
          <button className="text-white hover:text-gray-300 focus:outline-none">
            <Icons.BiBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </button>
        </div>

        <div className="relative">
          <button className="text-white hover:text-gray-300 focus:outline-none">
            <Icons.BiChat className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center text-white hover:text-gray-300 focus:outline-none"
          >
            <span className="ml-2 hidden md:block">{user?.username}</span>
            <Icons.BiChevronDown className="ml-1 h-5 w-5" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <div className="px-4 py-2 border-b">
                <h6 className="font-semibold text-gray-800">
                  {user?.username}
                </h6>
                <span className="text-sm text-gray-600">{user?.role}</span>
              </div>
              <Link
                to="/profile" // Corrigido o caminho para "/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.IoPersonCircleSharp className="mr-2 h-5 w-5" />
                <span>Meu Perfil</span>
              </Link>
              <Link
                to="/"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.CiBoxList className="mr-2 h-5 w-5" />
                <span>Sair</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
