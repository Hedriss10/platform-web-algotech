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
const TablesFinance = lazy(() => import("../module/Finance/Tables/TablesFinance"));

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
          <Route path="/tablesfinance/:id/:id" element={<TablesFinance />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
