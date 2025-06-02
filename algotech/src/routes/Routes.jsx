import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectRoutes';

// Componentes lazy-loaded
const Home = lazy(() => import('../module/components/Home'));
const Login = lazy(() => import('../module/Login/Login'));
const ManageUsers = lazy(() => import('../module/user/Users'));
const RegisterUser = lazy(() => import('../module/user/RegisterUser'));
const UpdateUsers = lazy(() => import('../module/user/UpdateUsers'));
const Profile = lazy(() => import('../module/profile/Profile'));
const RoleUsers = lazy(() => import('../module/user/RoleUsers'));
const RolersRegister = lazy(() => import('../module/user/RegisterRoles'));
const Rooms = lazy(() => import('../module/Rooms/Rooms'));
const RegisterRooms = lazy(() => import('../module/Rooms/RegisterRooms'));
const PreviewRooms = lazy(() => import('../module/Rooms/PreviewRooms'));
const UpdateRooms = lazy(() => import('../module/Rooms/UpdateRooms'));
const UsersRooms = lazy(() => import('../module/Rooms/AssociateUserRooms'));
const PreviewFinance = lazy(() => import('../module/Finance/PreviewFinance'));
const CardsBank = lazy(() => import('../module/Finance/CardBank'));
const RegisterBank = lazy(() => import('../module/Finance/RegisterBank'));
const UpdateBank = lazy(() => import('../module/Finance/UpdateBank'));
const TablesFinance = lazy(() => import('../module/Finance/Tables/TablesFinance'));
const RegisterTablesFinance = lazy(() => import('../module/Finance/Tables/RegisterTablesFinance'));
const ImportTablesFinance = lazy(() => import('../module/Finance/Tables/ImportsTablesFinance'));
const FinancialAgreements = lazy(() => import('../module/Finance/FinancialAgreements/RegisterFinancialAgreements'));
const RegisterFinanciaAgreements = lazy(() => import('../module/Finance/FinancialAgreements/RegisterFinancialAgreement'));
const RegisterTablesOneFinance = lazy(() => import('../module/Finance/Tables/ResgisterTablesOneFinance'));
const PreviewReport = lazy(() => import('../module/Finance/Report/PreviewReport'));
const ListPayment = lazy(() => import('../module/Finance/Report/Payment/ListPayment'));
const PreviewFlags = lazy(() => import('../module/Finance/Flags/PreviewFlags'));
const RegisterFlags = lazy(() => import('../module/Finance/Flags/RegisterFlags'));
const PreviewPayments = lazy(() => import('../module/Finance/Report/Payment/PreviewPayments'));
const ImportsReports = lazy(() => import('../module/Finance/Report/ImportReports'));
const ProcessPayments = lazy(() => import('../module/Finance/Report/Payment/ProcessPayment'));
const ManageOperationFinance = lazy(() => import('../module/Finance/ManageFinance/ManageOperationFinance'));
const RegisterOperationsFinance = lazy(() => import('../module/Finance/ManageFinance/RegisterOperationsFinance'));
const PreviewSellers = lazy(() => import('../module/Sellers/Proposal/PreviewSellers'));
const PreviewProposalById = lazy(() => import('../module/Sellers/Proposal/PreviewProposal'));
const UpdateProposalById = lazy(() => import('../module/Sellers/Proposal/UpdateProposal'));
const RegisterProposal = lazy(() => import('../module/Sellers/Proposal/RegisterProposal'));
const RankingTables = lazy(() => import('../module/Sellers/RankingTables/RankingTables'));
const Profit = lazy(() => import('../module/Sellers/Profit/Profit'));
const PreviewOperational = lazy(() => import('../module/Operational/PreviewOperational'));
const Operacional = lazy(() => import('../module/Operational/Proposal/Operational'));
const UpdateProposalOperational = lazy(() => import('../module/Operational/Proposal/UpdateOperational'));
const RankingSellers = lazy(() => import('../module/Sellers/RankingSellers/RankingSellers'));
const PreviewDashBoard = lazy(() => import('../module/Dashboard/PreviewDashboard'));
const PaymentsProvided = lazy(() => import('../module/Finance/ServiceProvided/ServiceProvided'));

// Configuração das rotas
const routes = [
  { path: '/', element: <Login />, public: true },
  { path: '/home', element: <Home /> },
  { path: '/users', element: <ManageUsers /> },
  { path: '/roles', element: <RoleUsers /> },
  { path: '/newrole', element: <RolersRegister /> },
  { path: '/newrooms', element: <RegisterRooms /> },
  { path: '/register', element: <RegisterUser /> },
  { path: '/profile', element: <Profile /> },
  { path: '/rooms', element: <Rooms /> },
  { path: '/usersrooms', element: <UsersRooms /> },
  { path: '/finance', element: <PreviewFinance /> },
  { path: '/users/update/:id', element: <UpdateUsers /> },
  { path: '/rooms/:id', element: <PreviewRooms /> },
  { path: '/rooms/update/:id', element: <UpdateRooms /> },
  { path: '/bank/:id', element: <CardsBank /> },
  { path: '/newbank', element: <RegisterBank /> },
  { path: '/bank/update/:id', element: <UpdateBank /> },
  { path: '/newtablesfinance/:id', element: <RegisterTablesFinance /> },
  { path: '/importablesfinance', element: <ImportTablesFinance /> },
  { path: '/tablesfinance/:bankerId/:financialAgreementsId', element: <TablesFinance /> },
  { path: '/financialagreements/:id', element: <FinancialAgreements /> },
  { path: '/financialagreements', element: <RegisterFinanciaAgreements /> },
  { path: '/paymentsprovided', element: <PaymentsProvided /> },
  { path: '/manageoperationfinance', element: <ManageOperationFinance /> },
  { path: '/register-operations', element: <RegisterOperationsFinance /> },
  { path: '/addtables/:id', element: <RegisterTablesOneFinance /> },
  { path: '/report', element: <PreviewReport /> },
  { path: '/payments-processed', element: <ListPayment /> },
  { path: '/flags', element: <PreviewFlags /> },
  { path: '/newflag', element: <RegisterFlags /> },
  { path: '/preview-payments', element: <PreviewPayments /> },
  { path: '/import-reports', element: <ImportsReports /> },
  { path: '/process-payments', element: <ProcessPayments /> },
  { path: '/sellers', element: <PreviewSellers /> },
  { path: '/ranking-sellers', element: <RankingSellers /> },
  { path: '/proposal', element: <RegisterProposal /> },
  { path: '/proposal/:id', element: <PreviewProposalById /> },
  { path: '/proposal/update/:id', element: <UpdateProposalById /> },
  { path: '/rankingtables', element: <RankingTables /> },
  { path: '/profit', element: <Profit /> },
  { path: '/operational', element: <PreviewOperational /> },
  { path: '/operational/proposal/:id', element: <Operacional /> },
  { path: '/operational/proposal/update/:id', element: <UpdateProposalOperational /> },
  { path: '/dashboard', element: <PreviewDashBoard /> },
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Carregando página...</div>}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.public ? (
                route.element
              ) : (
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              )
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;