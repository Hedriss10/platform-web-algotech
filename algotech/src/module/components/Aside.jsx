import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";
import Permission from "../utils/Permissions";
import { useUser } from "../../service/UserContext";

const Aside = ({ isOpen }) => {
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

  return (
    <aside
      className={`w-64 bg-gray-800 text-white fixed top-15 bottom-0 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <ul className="p-4 space-y-2">
        {/* Dashboard */}
        {chekPermission(Permission.Administrador) && (
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            >
              <Icons.BiGrid className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </Link>
          </li>
        )}
        {/* Operacional */}
        {(chekPermission(Permission.Operacional) ||
          chekPermission(Permission.Financeiro) ||
          chekPermission(Permission.Administrador)) && (
          <li>
            <button
              onClick={() => toggleMenu("components")}
              className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            >
              <div className="flex items-center">
                <Icons.BiMenu className="h-5 w-5 mr-2" />
                <span>Operacional</span>
              </div>
              <Icons.BiChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${
                  openMenus.components ? "rotate-180" : ""
                }`}
              />
            </button>
            {openMenus.components && (
              <ul className="pl-6 mt-2 space-y-2">
                <Link
                  to="/operational"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegAddressBook className="text-sm mr-2" />
                  <span>Gerenciamento</span>
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
                <Link
                  to="/ranking-sellers"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaChartLine className="text-sm mr-2" />
                  <span>Ranking Operação</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Financeiro */}
        {(chekPermission(Permission.Financeiro) ||
          chekPermission(Permission.Administrador)) && (
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
                <Link
                  to="/manageoperationfinance"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                >
                  <Icons.FaRegMoneyBillAlt className="text-sm mr-2" />
                  <span>Operações Financeiras</span>
                </Link>
                <Link 
									to="/flags"
									className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
								>
                  <Icons.MdOutlinePaid className="text-sm mr-2" />
                  <span>Flags</span>
                </Link>
              </ul>
            )}
          </li>
        )}
        {/* Salas */}
        {(chekPermission(Permission.Suporte) ||
          chekPermission(Permission.Administrador)) && (
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
        )}
        {/* Gerenciamento de usuários */}
        {chekPermission(Permission.Administrador) && (
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
        )}
        {/* Pages Section */}
        <li className="nav-heading mt-6 mb-2 text-sm font-semibold uppercase text-gray-400">
          <span>Helpers</span>
        </li>
        {/* Profile */}
        <li className="nav-item">
          <Link
            to="/profile"
            className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
          >
            <Icons.MdPersonAddAlt className="text-xl mr-2" />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
