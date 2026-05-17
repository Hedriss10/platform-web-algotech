import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import BankerPage from "../pages/BankerPage";
import EmployeePage from "../pages/EmployeePage";
import HomePage from "../pages/HomePage";
import RoomsPage from "../pages/RoomsPage";
import LoanOperationsPage from "../pages/LoanOperationsPage";
import LoginPage from "../pages/LoginPage";
import NewProposalPage from "../pages/NewProposalPage";
import ProposalsPage from "../pages/ProposalsPage";

const DaycovalAutomationPage = lazy(
  () => import("../pages/DaycovalAutomationPage")
);

const SafraAutomationPage = lazy(() => import("../pages/SafraAutomationPage"));

function DaycovalAutomationSuspended() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-10 text-sm text-slate-500">
          A carregar automação Daycoval…
        </div>
      }
    >
      <DaycovalAutomationPage />
    </Suspense>
  );
}

function SafraAutomationSuspended() {
  return (
    <Suspense
      fallback={
        <div className="px-6 py-10 text-sm text-slate-500">
          A carregar automação Safra…
        </div>
      }
    >
      <SafraAutomationPage />
    </Suspense>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route index element={<HomePage />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="bankers" element={<BankerPage />} />
          <Route path="loan-operations" element={<LoanOperationsPage />} />
          <Route path="proposals/new" element={<NewProposalPage />} />
          <Route path="proposals" element={<ProposalsPage />} />
          <Route
            path="automation/daycoval"
            element={<DaycovalAutomationSuspended />}
          />
          <Route
            path="automation/safra"
            element={<SafraAutomationSuspended />}
          />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
