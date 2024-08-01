import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
  allow,
  redirectPath = "/login",
  children,
}: {
  allow: boolean;
  redirectPath: string;
  children: any;
}) => {
  if (!allow) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
