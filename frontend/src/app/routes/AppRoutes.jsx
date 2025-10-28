import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import VendorDashboard from "../../pages/VendorDashboard";
import CustomerDashboard from "../../pages/CustomerDashboard";
import AppLayout from "../../layout/Applayout";
import UnAuthorized from "../../pages/UnAuthorized";
import NotFound from "../../pages/NotFound";
import { AuthContext } from "../../context/AuthContext";
import CommonDashboard from "../../pages/CommonDashboard";

const AppRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["admin", "customer"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CommonDashboard />} replace/>

          <Route
            path="vendorDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="customerDashboard"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
