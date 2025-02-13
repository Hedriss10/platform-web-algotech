import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../module/components/Home";
import Login from "../module/Login/Login";

/**
 * AppRoutes component.
 *
 * This component renders the main routes of the application, using the
 * {@link https://reactrouter.com/en/main/route/render-methods `Routes` component}
 * from `react-router-dom`.
 *
 * @returns {JSX.Element} The main routes of the application.
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
