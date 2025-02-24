import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";

const Aside = ({ isOpen }) => {
  const [openMenus, setOpenMenus] = useState({
    components: false,
    forms: false,
    tables: false,
    charts: false,
    icons: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside
      className={`w-64 bg-gray-800 text-white fixed top-15 bottom-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <ul className="p-4 space-y-2">
        {/* Dashboard */}
        <li>
          <a
            href="#"
            className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
          >
            <Icons.BiGrid className="h-5 w-5 mr-2" />
            <span>Dashboard</span>
          </a>
        </li>

        {/* Components */}
        <li>
          <button
            onClick={() => toggleMenu("components")}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
          >
            <div className="flex items-center">
              <Icons.BiMenu className="h-5 w-5 mr-2" />
              <span>Components</span>
            </div>
            <Icons.BiChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                openMenus.components ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.components && (
            <ul className="pl-6 mt-2 space-y-2">
              {[
                "Alerts",
                "Accordion",
                "Badges",
                "Breadcrumbs",
                "Buttons",
                "Cards",
                "Carousel",
                "List group",
                "Modal",
                "Tabs",
                "Pagination",
                "Progress",
                "Spinners",
                "Tooltips",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <Icons.BiCircle className="h-4 w-4 mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Sellers */}
        <li>
          <button
            onClick={() => toggleMenu("forms")}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
          >
            <div className="flex items-center">
              <Icons.BiLayout className="h-5 w-5 mr-2" />
              <span>Área Comercial</span>
            </div>
            <Icons.BiChevronDown
              className={`h-5 w-5 transition-transform duration-300 ${
                openMenus.forms ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.forms && (
            <ul className="pl-6 mt-2 space-y-2">
              <Link
                to="/sellers"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              >
                <Icons.FaRegAddressBook className="text-sm mr-2" />
                <span>Proposta</span>
              </Link>
              <Link
                to="rankingtables"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              >
                <Icons.MdOutlineDashboard className="text-sm mr-2" />
                <span>Ranking Tabelas</span>
              </Link>
              <Link
                to="/profit"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              >
                <Icons.FaRegMoneyBillAlt className="text-sm mr-2" />
                <span>Expectativa de Ganhos</span>
              </Link>
            </ul>
          )}
        </li>

        {/* Financeiro */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("tables")}
          >
            <div className="flex items-center">
              <Icons.FaRegMoneyBillAlt className="text-xl mr-2" />
              <span>Financeiro</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.tables ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.tables && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              <Link
                to="/finance"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              >
                <Icons.MdOutlineManageAccounts className="text-sm mr-2" />
                <span>Gestão Bancária</span>
              </Link>
              <Link
                to="/report"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              >
                <Icons.HiOutlineDocumentReport className="text-sm mr-2" />
                <span>Relatório</span>
              </Link>
            </ul>
          )}
        </li>

        {/* salas */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("charts")}
          >
            <div className="flex items-center">
              <Icons.BiBarChart className="text-xl mr-2" />
              <span>Salas</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.charts ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.charts && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/rooms"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaHouseUser className="text-sm mr-2" />
                  <span>Gerenciamento</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Gerenciamento de usuários */}
        <li className="nav-item">
          <button
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300 w-full text-left"
            onClick={() => toggleMenu("icons")}
          >
            <div className="flex items-center">
              <Icons.FaRegUser className="text-xl mr-2" />
              <span>Usuários</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.icons ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.icons && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              <li>
                <Link
                  to="/users"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaHouseUser className="text-sm mr-2" />
                  <span>Gerenciamento</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaUsersGear className="text-sm mr-2" />
                  <span>Cadastrar</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/roles"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlineWork className="text-sm mr-2" />
                  <span>Cargos</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Pages Section */}
        <li className="nav-heading mt-6 mb-2 text-sm font-semibold uppercase text-gray-400">
          Páginas
        </li>

        {/* Profile */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="users-profile.html"
          >
            <Icons.MdPersonAddAlt className="text-xl mr-2" />
            <span>Profile</span>
          </a>
        </li>

        {/* FAQ */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-faq.html"
          >
            <Icons.MdOutlineQuestionAnswer className="text-xl mr-2" />
            <span>F.A.Q</span>
          </a>
        </li>

        {/* Contact */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-contact.html"
          >
            <Icons.BiEnvelope className="text-xl mr-2" />
            <span>Contact</span>
          </a>
        </li>

        {/* Register */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-register.html"
          >
            <Icons.IoListSharp className="text-xl mr-2" />
            <span>Register</span>
          </a>
        </li>

        {/* Login */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-login.html"
          >
            <Icons.BiLogIn className="text-xl mr-2" />
            <span>Login</span>
          </a>
        </li>

        {/* Error 404 */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-error-404.html"
          >
            <Icons.BiErrorCircle className="text-xl mr-2" />
            <span>Error 404</span>
          </a>
        </li>

        {/* Blank Page */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="pages-blank.html"
          >
            <Icons.BiFile className="text-xl mr-2" />
            <span>Blank</span>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
