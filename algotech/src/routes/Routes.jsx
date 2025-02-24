import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectRoutes";

const Home = lazy(() => import("../module/components/Home"));
const Login = lazy(() => import("../module/Login/Login"));
const ManageUsers = lazy(() => import("../module/User/Users"));
const RegisterUser = lazy(() => import("../module/User/RegisterUser"));
const UpdateUsers = lazy(() => import("../module/User/UpdateUsers"));
const Profile = lazy(() => import("../module/Profile/Profile"));
const RoleUsers = lazy(() => import("../module/User/RoleUsers"));
const RolersRegister = lazy(() => import("../module/User/RegisterRoles"));
const Rooms = lazy(() => import("../module/Rooms/Rooms"));
const RegisterRooms = lazy(() => import("../module/Rooms/RegisterRooms"));
const PreviewRooms = lazy(() => import("../module/Rooms/PreviewRooms"));
const UsersRooms = lazy(() => import("../module/Rooms/AssociateUserRooms"));
const PreviewFinance = lazy(() => import("../module/Finance/PreviewFinance"));
const CardsBank = lazy(() => import("../module/Finance/CardBank"));
const RegisterBank = lazy(() => import("../module/Finance/RegisterBank"));
const UpdateBank = lazy(() => import("../module/Finance/UpdateBank"));
const TablesFinance = lazy(
  () => import("../module/Finance/Tables/TablesFinance"),
);
const RegisterTablesFinance = lazy(
  () => import("../module/Finance/Tables/RegisterTablesFinance"),
);
const FinancialAgreements = lazy(
  () =>
    import("../module/Finance/FinancialAgreements/RegisterFinancialAgreements"),
);
const RegisterTablesOneFinance = lazy(
  () => import("../module/Finance/Tables/ResgisterTablesOneFinance"),
);
const PreviewReport = lazy(
  () => import("../module/Finance/Report/PreviewReport"),
);
const ListPayment = lazy(
  () => import("../module/Finance/Report/Payment/ListPayment"),
);
const PreviewFlags = lazy(
  () => import("../module/Finance/Report/Flags/PreviewFlags"),
);

const RegisterFlags = lazy(
  () => import("../module/Finance/Report/Flags/RegisterFlags"),
);

const ReportManager = lazy(
  () => import("../module/Finance/Report/ReportManager"),
);

const PreviewPayments = lazy(
  () => import("../module/Finance/Report/Payment/PreviewPayments"),
);

const ImportsReports = lazy(
  () => import("../module/Finance/Report/ImportReports"),
);

const ProcessPayments = lazy(
  () => import("../module/Finance/Report/Payment/ProcessPayment"),
);

const PreviewSellers = lazy(() => import("../module/Sellers/Proposal/PreviewSellers"));

const PreviewProposalById = lazy(() => import("../module/Sellers/Proposal/PreviewProposal"));

const UpdateProposalById = lazy(() => import("../module/Sellers/Proposal/UpdateProposal"))

const RegisterProposal = lazy(() => import("../module/Sellers/Proposal/RegisterProposal"));

const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/roles" element={<RoleUsers />} />
          <Route path="/newrole" element={<RolersRegister />} />
          <Route path="/newrooms" element={<RegisterRooms />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/usersrooms" element={<UsersRooms />} />
          <Route path="/finance" element={<PreviewFinance />} />
          <Route path="/users/update/:id" element={<UpdateUsers />} />
          <Route path="/rooms/:id" element={<PreviewRooms />} />
          <Route path="/bank/:id" element={<CardsBank />} />
          <Route path="/newbank" element={<RegisterBank />} />
          <Route path="/bank/update/:id" element={<UpdateBank />} />
          <Route
            path="/newtablesfinance/:id"
            element={<RegisterTablesFinance />}
          />
          <Route
            path="/tablesfinance/:bankerId/:financialAgreementsId"
            element={<TablesFinance />}
          />
          <Route
            path="/financialagreements/:id"
            element={<FinancialAgreements />}
          />
          <Route path="/addtables/:id" element={<RegisterTablesOneFinance />} />
          <Route path="/report" element={<PreviewReport />} />
          <Route path="/payments-processed" element={<ListPayment />} />
          <Route path="/flags" element={<PreviewFlags />} />
          <Route path="/newflag" element={<RegisterFlags />} />
          <Route path="/gerement-reports" element={<ReportManager />} />
          <Route path="/preview-payments" element={<PreviewPayments />} />
          <Route path="/import-reports" element={<ImportsReports />} />
          <Route path="/process-payments" element={<ProcessPayments />} />
          <Route path="/sellers" element={<PreviewSellers />} />
          <Route path="/proposal" element={<RegisterProposal />} />
          <Route path="/proposal/:id" element={<PreviewProposalById />} />
          <Route path="/proposal/update/:id" element={<UpdateProposalById />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
