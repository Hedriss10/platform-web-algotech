import React, { useState } from "react";
import Icons from "../utils/Icons";

const Header = ({ toggleAside }) => {
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
        <a href="/" className="flex items-center ml-4">
          <span className="text-xl font-semibold hidden lg:block">maisbs</span>
        </a>
      </div>

      {/* Menu de navegação */}
      <nav className="flex items-center space-x-6">
        {/* Ícone de notificações */}
        <div className="relative">
          <button className="text-white hover:text-gray-300 focus:outline-none">
            <Icons.BiBell className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              4
            </span>
          </button>
        </div>

        {/* Ícone de chat */}
        <div className="relative">
          <button className="text-white hover:text-gray-300 focus:outline-none">
            <Icons.BiChat className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        </div>

        {/* Menu de perfil */}
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center text-white hover:text-gray-300 focus:outline-none"
          >
            {/* <img
              src="assets/img/profile-img.jpg"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            /> */}
            <span className="ml-2 hidden md:block">K. Anderson</span>
            <Icons.BiChevronDown className="ml-1 h-5 w-5" />
          </button>

          {/* Dropdown do perfil */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <div className="px-4 py-2 border-b">
                <h6 className="font-semibold text-gray-800">Kevin Anderson</h6>
                <span className="text-sm text-gray-600">Web Designer</span>
              </div>
              <a
                href="users-profile.html"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.IoPersonCircleSharp className="mr-2 h-5 w-5" />
                <span>My Profile</span>
              </a>
              <a
                href="users-profile.html"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.GoGear className="mr-2 h-5 w-5" />
                <span>Account Settings</span>
              </a>
              <a
                href="pages-faq.html"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.BiCircle className="mr-2 h-5 w-5" />
                <span>Need Help?</span>
              </a>
              <a
                href="#"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Icons.CiBoxList className="mr-2 h-5 w-5" />
                <span>Sign Out</span>
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
