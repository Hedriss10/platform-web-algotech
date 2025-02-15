import React from "react";

/**
 * Footer component.
 *
 * This component renders the footer of the application, displaying
 * the current year, the name "NiceAdmin", and a link to the designer's
 * website, BootstrapMade, accompanied by a heart icon from react-icons.
 *
 * @returns {JSX.Element} The footer component with branding and design credits.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <div className="text-sm">
        &copy; {new Date().getFullYear()}{" "}
        <strong className="text-blue-400">Maisbs</strong>. All Rights Reserved.
      </div>
      {/* <div className="text-sm mt-2 flex items-center justify-center gap-1">
        Designed by
        <a
          href="https://bootstrapmade.com/"
          className="text-blue-400 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          
        </a>
        <Icons.FaHeart className="text-blue-500" />
      </div> */}
    </footer>
  );
};

export default Footer;
