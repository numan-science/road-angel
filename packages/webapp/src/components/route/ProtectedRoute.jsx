import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import appConfig from "@/configs/app.config";
import useAuth from "@/utils/hooks/useAuth";

const { UN_AUTHENTICATED_ENTRY_PATH } = appConfig;

const ProtectedRoute = () => {
  const { authenticated } = useAuth();
  if (!authenticated) {
    return <Navigate to={UN_AUTHENTICATED_ENTRY_PATH} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;