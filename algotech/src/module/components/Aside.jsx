import React, { useState } from "react";
import Icons from "../utils/Icons";

/**
 * The sidebar component.
 *
 * This component renders the sidebar with links to
 * different parts of the application.
 *
 * @returns {React.ReactElement} The sidebar component.
 */
const Aside = () => {
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
    <aside id="sidebar" className="w-64 bg-gray-800 text-white min-h-screen">
      <ul className="sidebar-nav p-4 space-y-2">
        {/* Dashboard */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
            href="index.html"
          >
            <Icons.BiGrid className="text-xl mr-2" />
            <span>Dashboard</span>
          </a>
        </li>

        {/* Components */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("components")}
          >
            <div className="flex items-center">
              <Icons.BiMenu className="text-xl mr-2" />
              <span>Components</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.components ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.components && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
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
                    href=""
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <Icons.BiCircle className="text-sm mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Forms */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("forms")}
          >
            <div className="flex items-center">
              <Icons.BiLayout className="text-xl mr-2" />
              <span>Forms</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.forms ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.forms && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              {["Elements", "Layouts", "Editors", "Validation"].map((item) => (
                <li key={item}>
                  <a
                    href={`forms-${item.toLowerCase()}.html`}
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <BiCircle className="text-sm mr-2" />
                    <span>Form {item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Tables */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("tables")}
          >
            <div className="flex items-center">
              <Icons.BiLayout className="text-xl mr-2" />
              <span>Tables</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.tables ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.tables && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              {["General Tables", "Data Tables"].map((item) => (
                <li key={item}>
                  <a
                    href={`tables-${item.toLowerCase().replace(" ", "-")}.html`}
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <Icons.BiCircle className="text-sm mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Charts */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("charts")}
          >
            <div className="flex items-center">
              <Icons.BiBarChart className="text-xl mr-2" />
              <span>Charts</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.charts ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.charts && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              {["Chart.js", "ApexCharts", "ECharts"].map((item) => (
                <li key={item}>
                  <a
                    href={`charts-${item.toLowerCase()}.html`}
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <Icons.BiCircle className="text-sm mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Icons */}
        <li className="nav-item">
          <a
            className="nav-link flex items-center justify-between p-2 hover:bg-gray-700 rounded transition duration-300"
            onClick={() => toggleMenu("icons")}
          >
            <div className="flex items-center">
              <Icons.FaRegGem className="text-xl mr-2" />
              <span>Icons</span>
            </div>
            <Icons.BiChevronDown
              className={`text-xl transition-transform duration-300 ${
                openMenus.icons ? "rotate-180" : ""
              }`}
            />
          </a>
          {openMenus.icons && (
            <ul className="nav-content pl-6 mt-2 space-y-2">
              {["Bootstrap Icons", "Remix Icons", "Boxicons"].map((item) => (
                <li key={item}>
                  <a
                    href={`icons-${item.toLowerCase().replace(" ", "-")}.html`}
                    className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300"
                  >
                    <Icons.BiCircle className="text-sm mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>

        {/* Pages Section */}
        <li className="nav-heading mt-6 mb-2 text-sm font-semibold uppercase text-gray-400">
          Pages
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
