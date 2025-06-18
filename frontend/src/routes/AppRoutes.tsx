import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { useAuth } from "../contexts/AuthContext";
import { Flex, Loader } from "@chakra-ui/react";
import DashboardPage from "../pages/DashboardPage";

const PrivateRouteOutlet: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Loader />
      </Flex>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Loader />
      </Flex>
    );
  }
  // После определения статуса, перенаправляем
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const NotFoundRedirect: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Loader />
      </Flex>
    );
  }
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRouteOutlet />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
