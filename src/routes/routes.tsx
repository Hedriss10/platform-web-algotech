import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import EmployeePage from "../pages/EmployeePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="employee" element={<EmployeePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
