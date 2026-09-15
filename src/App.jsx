import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import FindDonors from "./pages/FindDonors.jsx";
import BecomeDonor from "./pages/BecomeDonor.jsx";
import DonorRequests from "./pages/DonorRequests.jsx";
import RequestBlood from "./pages/RequestBlood.jsx";
import MyRequests from "./pages/MyRequests.jsx";
import RequestDetails from "./pages/RequestDetails.jsx";
import Hospitals from "./pages/Hospitals.jsx";
import HospitalDetails from "./pages/HospitalDetails.jsx";
import EmergencyContacts from "./pages/EmergencyContacts.jsx";
import Profile from "./pages/Profile.jsx";
import Notifications from "./pages/Notifications.jsx";
import NotFound from "./pages/NotFound.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminDonors from "./pages/admin/AdminDonors.jsx";
import AdminRequests from "./pages/admin/AdminRequests.jsx";
import AdminHospitals from "./pages/admin/AdminHospitals.jsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => (
  <>
    <ScrollToTop />

    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donors" element={<FindDonors />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:id" element={<HospitalDetails />} />
        <Route path="/request-blood" element={<RequestBlood />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/become-donor" element={<BecomeDonor />} />
          <Route path="/donor/requests" element={<DonorRequests />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="donors" element={<AdminDonors />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="hospitals" element={<AdminHospitals />} />
          </Route>
        </Route>

        <Route
          path="/donor-register"
          element={<Navigate to="/become-donor" replace />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>
);

export default App;