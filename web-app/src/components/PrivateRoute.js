import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const adminUrls = [
  "/admin/dashboard",
  "/admin/branches",
  "/admin/branches/create-branch",
  "/admin/branches/:id/parcels",
  "/admin/staff-list",
  "/admin/staff-list/create-staff",
  "/admin/staff-list/:id/update-staff",
  "/admin/branches/:id/update-branch",
  "/admin/branches/:id/parcels",
  "/admin/branches/:id/parcels/:parcelId/details",
];

const staffUrls = [
  "/staff/dashboard",
  "/staff/parcels",
  "/staff/parcels/create-parcel",
  "/staff/parcels/:id/update-parcel",
  "/staff/parcels/:id/details",
];

function PrivateRoute({ path, element: Component }) {
  const { isAuthenticated, isAdmin } = useAuth();

  let hasAccess = false;
  if (adminUrls.includes(path)) {
    hasAccess = isAuthenticated() && isAdmin();
  } else if (staffUrls.includes(path)) {
    hasAccess = isAuthenticated() && !isAdmin();
  }
  return <>{hasAccess ? <Component /> : <Navigate to="/access-denied" />}</>;
}

export default PrivateRoute;
