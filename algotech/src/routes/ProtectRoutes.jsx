import { useUser } from "../service/UserContext";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const {user, token} = useUser();

  if (token && user) {
    return <Outlet />;
  }
  else{
    return <Navigate to="/" />
  }
};
