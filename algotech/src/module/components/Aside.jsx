import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";
import Permission from "../utils/Permissions";
import { useUser } from "../../service/UserContext";

const Aside = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
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

  const chekPermission = (permission) => {
    return user?.role === permission;
  };

  const handleMenuClick = (menu) => {
    if (!isOpen) {
      setIsOpen(true); // Abre o aside
      setOpenMenus((prev) => ({
        ...prev,
        [menu]: true, // Abre o submenu correspondente
      }));
    } else {
      toggleMenu(menu); // Alterna o submenu se o aside já estiver aberto
    }
  };

  // Sincroniza os submenus quando o aside é aberto
  useEffect(() => {
    if (!isOpen) {
      // Fecha todos os submenus quando o aside é fechado
      setOpenMenus({
        components: false,
        forms: false,
        tables: false,
        charts: false,
        icons: false,
      });
    }
  }, [isOpen]);

  return (
    <aside
      className={`bg-gray-800 text-white fixed top-15 bottom-0 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64 translate-x-0" : "w-16 translate-x-0"
      }`}
    >
      <ul className="p-4 space-y-2">
        {/* Dashboard */}
        {chekPermission(Permission.Administrador) && (
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Dashboard"}
            >
              <Icons.BiGrid className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-2">Dashboard</span>}
            </Link>
          </li>
        )}
        {/* Operacional */}
        {(chekPermission(Permission.Operacional) ||
          chekPermission(Permission.Financeiro) ||
          chekPermission(Permission.Administrador)) && (
          <li>
            <button
              onClick={() => handleMenuClick("components")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Operacional"}
            >
              <div className="flex items-center">
                <Icons.BiMenu className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-2">Operacional</span>}
              </div>
              {isOpen && (
                <Icons.BiChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openMenus.components ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenus.components && isOpen && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/operational"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegAddressBook className="text-sm flex-shrink-0" />
                  <span className="ml-2">Gerenciamento</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Sellers */}
        {(chekPermission(Permission.Vendedor) ||
          chekPermission(Permission.Financeiro) ||
          chekPermission(Permission.Administrador)) && (
          <li>
            <button
              onClick={() => handleMenuClick("forms")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Área Comercial"}
            >
              <div className="flex items-center">
                <Icons.BiLayout className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="ml-2">Área Comercial</span>}
              </div>
              {isOpen && (
                <Icons.BiChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    openMenus.forms ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenus.forms && isOpen && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/sellers"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegAddressBook className="text-sm flex-shrink-0" />
                  <span className="ml-2">Proposta</span>
                </Link>
                <Link
                  to="/rankingtables"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlineDashboard className="text-sm flex-shrink-0" />
                  <span className="ml-2">Ranking Tabelas</span>
                </Link>
                <Link
                  to="/profit"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegMoneyBillAlt className="text-sm flex-shrink-0" />
                  <span className="ml-2">Expectativa de Ganhos</span>
                </Link>
                <Link
                  to="/ranking-sellers"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaChartLine className="text-sm flex-shrink-0" />
                  <span className="ml-2">Ranking Operação</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Financeiro */}
        {(chekPermission(Permission.Financeiro) ||
          chekPermission(Permission.Administrador)) && (
          <li>
            <button
              onClick={() => handleMenuClick("tables")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Financeiro"}
            >
              <div className="flex items-center">
                <Icons.FaRegMoneyBillAlt className="text-xl flex-shrink-0" />
                {isOpen && <span className="ml-2">Financeiro</span>}
              </div>
              {isOpen && (
                <Icons.BiChevronDown
                  className={`text-xl transition-transform duration-300 ${
                    openMenus.tables ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenus.tables && isOpen && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/finance"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlineManageAccounts className="text-sm flex-shrink-0" />
                  <span className="ml-2">Gestão Bancária</span>
                </Link>
                <Link
                  to="/report"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.HiOutlineDocumentReport className="text-sm flex-shrink-0" />
                  <span className="ml-2">Relatório</span>
                </Link>
                <Link
                  to="/manageoperationfinance"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegMoneyBillAlt className="text-sm flex-shrink-0" />
                  <span className="ml-2">Operações Financeiras</span>
                </Link>
                <Link
                  to="/flags"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlinePaid className="text-sm flex-shrink-0" />
                  <span className="ml-2">Flags</span>
                </Link>
                <Link
                  to="/financialagreements"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlineCommentBank className="text-sm flex-shrink-0" />
                  <span className="ml-2">Convênios</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Salas */}
        {(chekPermission(Permission.Suporte) ||
          chekPermission(Permission.Administrador)) && (
          <li>
            <button
              onClick={() => handleMenuClick("charts")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Salas"}
            >
              <div className="flex items-center">
                <Icons.BiBarChart className="text-xl flex-shrink-0" />
                {isOpen && <span className="ml-2">Salas</span>}
              </div>
              {isOpen && (
                <Icons.BiChevronDown
                  className={`text-xl transition-transform duration-300 ${
                    openMenus.charts ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenus.charts && isOpen && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/rooms"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaHouseUser className="text-sm flex-shrink-0" />
                  <span className="ml-2">Gerenciamento</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Gerenciamento de usuários */}
        {chekPermission(Permission.Administrador) && (
          <li>
            <button
              onClick={() => handleMenuClick("icons")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
              title={isOpen ? "" : "Usuários"}
            >
              <div className="flex items-center">
                <Icons.FaRegUser className="text-xl flex-shrink-0" />
                {isOpen && <span className="ml-2">Usuários</span>}
              </div>
              {isOpen && (
                <Icons.BiChevronDown
                  className={`text-xl transition-transform duration-300 ${
                    openMenus.icons ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
            {openMenus.icons && isOpen && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/users"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaHouseUser className="text-sm flex-shrink-0" />
                  <span className="ml-2">Gerenciamento</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaUsersGear className="text-sm flex-shrink-0" />
                  <span className="ml-2">Cadastrar</span>
                </Link>
                <Link
                  to="/roles"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.MdOutlineWork className="text-sm flex-shrink-0" />
                  <span className="ml-2">Cargos</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Pages Section */}
        {isOpen && (
          <li className="nav-heading mt-6 mb-2 text-sm font-semibold uppercase text-gray-400">
            <span>Helpers</span>
          </li>
        )}
        {/* Profile */}
        <li>
          <Link
            to="/profile"
            className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            title={isOpen ? "" : "Profile"}
          >
            <Icons.MdPersonAddAlt className="text-xl flex-shrink-0" />
            {isOpen && <span className="ml-2">Profile</span>}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
