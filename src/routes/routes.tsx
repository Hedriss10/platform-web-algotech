import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import BankerPage from "../pages/BankerPage";
import EmployeePage from "../pages/EmployeePage";
import HomePage from "../pages/HomePage";
import LoanOperationsPage from "../pages/LoanOperationsPage";
import LoginPage from "../pages/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="bankers" element={<BankerPage />} />
          <Route path="loan-operations" element={<LoanOperationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
