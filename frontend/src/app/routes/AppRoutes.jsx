import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import VendorDashboard from "../../pages/VendorDashboard";
import CustomerDashboard from "../../pages/CustomerDashboard";
import AppLayout from "../../layout/Applayout";

const AppRoutes = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute
              children={<AppLayout />}
              allowedRoles={["admin", "customer"]}
            />
          }
        >
          <Route index element={<Navigate to="VendorDashboard" replace />} />

          <Route
            path="VendorDashboard"
            element={
              <ProtectedRoute
                children={<VendorDashboard />}
                allowedRoles={["admin"]}
              />
            }
          />
          <Route
            path="CustomerDashboard"
            element={
              <ProtectedRoute
                children={<CustomerDashboard />}
                allowedRoles={["customer"]}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
