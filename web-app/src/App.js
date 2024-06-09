import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import moment from "moment";
import "moment-timezone";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AccessDenied from "./admin/AccessDenied";
import AdminDashBoard from "./admin/AdminDashBoard";
import AdminLogin from "./admin/AdminLogin";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import BranchList from "./pages/branches/BranchesList";
import CreateBranch from "./pages/branches/CreateBranch";
import ParcelList from "./pages/branches/ParcelList";
import UpdateBranch from "./pages/branches/UpdateBranch";
import Home from "./pages/home/Home";
import NotFound from "./pages/home/NotFound";
import Login from "./pages/login/Login";
import Logout from "./pages/login/Logout";
import CreateParcel from "./pages/parcels/CreateParcel";
import ParcelPage from "./pages/parcels/Parcel";
import UpdateParcel from "./pages/parcels/UpdateParcel";
import CreateStaff from "./pages/staff/CreateStaff";
import Dashboard from "./pages/staff/DashBaord";
import StaffList from "./pages/staff/StaffList";
import UpdateStaff from "./pages/staff/UpdateStaff";
import {Toaster}  from "react-hot-toast";

moment.tz.setDefault("UTC");

const theme = createTheme({
  palette: {
    primary: {
      main: "#4d148c",
    },
    secondary: {
      main: "#FFC107",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/staff/login" element={<Login />} />
              <Route
                exact
                path="/staff/dashboard"
                element={
                  <PrivateRoute path="/staff/dashboard" element={Dashboard} />
                }
              />
              <Route
                exact
                path="/staff/parcels"
                element={
                  <PrivateRoute path="/staff/parcels" element={ParcelList} />
                }
              />
              <Route
                exact
                path="/staff/parcels/create-parcel"
                element={
                  <PrivateRoute
                    path="/staff/parcels/create-parcel"
                    element={CreateParcel}
                  />
                }
              />
              <Route
                exact
                path="/staff/parcels/:id/update-parcel"
                element={
                  <PrivateRoute
                    path="/staff/parcels/:id/update-parcel"
                    element={UpdateParcel}
                  />
                }
              />
              <Route
                exact
                path="/staff/parcels/:id/details"
                element={
                  <PrivateRoute
                    path="/staff/parcels/:id/details"
                    element={ParcelPage}
                  />
                }
              />

              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/access-denied" element={<AccessDenied />} />

              {/* admin urls */}
              <Route exact path="/admin/login" element={<AdminLogin />} />
              <Route
                exact
                path="/admin/dashboard"
                element={
                  <PrivateRoute
                    path="/admin/dashboard"
                    element={AdminDashBoard}
                  />
                }
              />
              <Route
                exact
                path="/admin/staff-list"
                element={
                  <PrivateRoute path="/admin/staff-list" element={StaffList} />
                }
              />
              <Route
                exact
                path="/admin/staff-list/create-staff"
                element={
                  <PrivateRoute
                    path="/admin/staff-list/create-staff"
                    element={CreateStaff}
                  />
                }
              />
              <Route
                exact
                path="/admin/staff-list/:id/update-staff"
                element={
                  <PrivateRoute
                    path="/admin/staff-list/:id/update-staff"
                    element={UpdateStaff}
                  />
                }
              />
              <Route
                exact
                path="/admin/branches"
                element={
                  <PrivateRoute path="/admin/branches" element={BranchList} />
                }
              />
              <Route
                exact
                path="/admin/branches/create-branch"
                element={
                  <PrivateRoute
                    path="/admin/branches/create-branch"
                    element={CreateBranch}
                  />
                }
              />
              <Route
                exact
                path="/admin/branches/:id/update-branch"
                element={
                  <PrivateRoute
                    path="/admin/branches/:id/update-branch"
                    element={UpdateBranch}
                  />
                }
              />
              <Route
                exact
                path="/admin/branches/:id/parcels"
                element={
                  <PrivateRoute
                    path="/admin/branches/:id/parcels"
                    element={ParcelList}
                  />
                }
              />
              <Route
                exact
                path="/admin/branches/:id/parcels/:parcelId/details"
                element={
                  <PrivateRoute
                    path="/admin/branches/:id/parcels/:parcelId/details"
                    element={ParcelPage}
                  />
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
