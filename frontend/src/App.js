// src/App.js - WITH OPTIONAL ENHANCEMENTS
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingChatbot from "./components/FloatingChatbot";
import LiveNotificationBanner from "./components/LiveNotificationBanner";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import SchedulesPage from "./pages/Schedules";

// Protected Pages
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Chat from "./components/Chat";
import ContactModal from "./components/ContactModal";

// Impact Pages
import CheckIn from "./components/CheckIn";
import PersonalImpact from "./components/ImpactDashboard/PersonalImpact";
import CommunityStats from "./components/ImpactDashboard/CommunityStats";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header />
      <LiveNotificationBanner />
      <Routes>
        {/* ========== PUBLIC ROUTES ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactModal />} />

        {/* Listings */}
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />

        {/* Public Impact Stats */}
        <Route path="/impact/community" element={<CommunityStats />} />

        {/* ========== PROTECTED ROUTES ========== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        {/* Profile - ✅ Can view any user's profile (public) */}
        {/* But own profile editing is protected */}
        <Route path="/profile/:userId" element={<Profile />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* 🆕 NEW: Schedules Route */}
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <SchedulesPage />
            </ProtectedRoute>
          }
        />

        {/* Chat Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Check-in (QR Verification) */}
        <Route
          path="/check-in"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />

        {/* Personal Impact */}
        <Route
          path="/impact/personal"
          element={
            <ProtectedRoute>
              <PersonalImpact />
            </ProtectedRoute>
          }
        />

        {/* ========== CATCH-ALL ROUTE ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FloatingChatbot />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
