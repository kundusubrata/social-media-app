import React from "react";
import { Navigate } from "react-router-dom";

const ProtectiveRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

export default ProtectiveRoute;
