import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icons from "../utils/Icons";
import Permission from "../utils/Permissions";
import { useUser } from "../../service/UserContext";

const menuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Icons.BiGrid,
    to: "/dashboard",
    permission: Permission.Administrador,
  },
  {
    id: "components",
    title: "Operacional",
    icon: Icons.BiMenu,
    permission: [
      Permission.Operacional,
      Permission.Financeiro,
      Permission.Administrador,
    ],
    subItems: [
      {
        title: "Gerenciamento",
        to: "/operational",
        icon: Icons.FaRegAddressBook,
      },
    ],
  },
  {
    id: "forms",
    title: "Área Comercial",
    icon: Icons.BiLayout,
    permission: [
      Permission.Vendedor,
      Permission.Financeiro,
      Permission.Administrador,
    ],
    subItems: [
      { title: "Proposta", to: "/sellers", icon: Icons.FaRegAddressBook },
      {
        title: "Ranking Tabelas",
        to: "/rankingtables",
        icon: Icons.MdOutlineDashboard,
      },
      {
        title: "Expectativa de Ganhos",
        to: "/profit",
        icon: Icons.FaRegMoneyBillAlt,
      },
      {
        title: "Ranking Operação",
        to: "/ranking-sellers",
        icon: Icons.FaChartLine,
      },
    ],
  },
  {
    id: "tables",
    title: "Financeiro",
    icon: Icons.FaRegMoneyBillAlt,
    permission: [Permission.Financeiro, Permission.Administrador],
    subItems: [
      {
        title: "Gestão Bancária",
        to: "/finance",
        icon: Icons.MdOutlineManageAccounts,
      },
      {
        title: "Relatório",
        to: "/report",
        icon: Icons.HiOutlineDocumentReport,
      },
      {
        title: "Operações Financeiras",
        to: "/manageoperationfinance",
        icon: Icons.FaRegMoneyBillAlt,
      },
      { title: "Flags", to: "/flags", icon: Icons.MdOutlinePaid },
      {
        title: "Convênios",
        to: "/financialagreements",
        icon: Icons.MdOutlineCommentBank,
      },
      {
        title: "Serviços Prestados",
        to: "/paymentsprovided",
        icon: Icons.BsPersonWorkspace,
      },
    ],
  },
  {
    id: "charts",
    title: "Salas",
    icon: Icons.BiBarChart,
    permission: [Permission.Suporte, Permission.Administrador],
    subItems: [
      { title: "Gerenciamento", to: "/rooms", icon: Icons.FaHouseUser },
    ],
  },
  {
    id: "icons",
    title: "Usuários",
    icon: Icons.FaRegUser,
    permission: Permission.Administrador,
    subItems: [
      { title: "Gerenciamento", to: "/users", icon: Icons.FaHouseUser },
      { title: "Cadastrar", to: "/register", icon: Icons.FaUsersGear },
      { title: "Cargos", to: "/roles", icon: Icons.MdOutlineWork },
    ],
  },
  {
    id: "profile",
    title: "Profile",
    icon: Icons.MdPersonAddAlt,
    to: "/profile",
    permission: null, // Accessible to all users
  },
];

const Aside = ({ isOpen, setIsOpen }) => {
  const { user } = useUser();
  const [openMenus, setOpenMenus] = useState({});

  const checkPermission = (permission) => {
    if (!permission) return true; // No permission required
    if (Array.isArray(permission)) {
      return permission.some((perm) => user?.role === perm);
    }
    return user?.role === permission;
  };

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleMenuClick = (menuId) => {
    if (!isOpen && typeof setIsOpen === "function") {
      setIsOpen(true);
      setOpenMenus((prev) => ({ ...prev, [menuId]: true }));
    } else {
      toggleMenu(menuId);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setOpenMenus({});
    }
  }, [isOpen]);

  return (
    <aside
      className={`bg-gray-800 text-white fixed top-15 bottom-0 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64 translate-x-0" : "w-16 translate-x-0"
      }`}
    >
      <ul className="p-4 space-y-2">
        {menuItems.map((item) => {
          if (!checkPermission(item.permission)) return null;

          const Icon = item.icon;
          const hasSubItems = item.subItems?.length > 0;

          return (
            <li key={item.id}>
              {hasSubItems ? (
                <>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
                    title={isOpen ? "" : item.title}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {isOpen && <span className="ml-2">{item.title}</span>}
                    </div>
                    {isOpen && (
                      <Icons.BiChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          openMenus[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {openMenus[item.id] && isOpen && (
                    <ul className="pl-6 mt-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.to}>
                          <Link
                            to={subItem.to}
                            className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                          >
                            <subItem.icon className="text-sm flex-shrink-0" />
                            <span className="ml-2">{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.to}
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  title={isOpen ? "" : item.title}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isOpen && <span className="ml-2">{item.title}</span>}
                </Link>
              )}
            </li>
          );
        })}
        {isOpen && (
          <li className="nav-heading mt-6 mb-2 text-sm font-semibold uppercase text-gray-400">
            <span>Helpers</span>
          </li>
        )}
      </ul>
    </aside>
  );
};

Aside.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func,
};

Aside.defaultProps = {
  setIsOpen: () => console.warn("setIsOpen is not provided"),
};

export default Aside;
