// src/App.js - COMPLETE WITH NOTIFICATION SYSTEM
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

// Protected Pages
import Dashboard from "./pages/Dashboard";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Chat from "./components/Chat";
import ContactModal from "./components/ContactModal";

// New Features
import VerifyPickup from "./pages/VerifyPickup";
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
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactModal />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/impact/community" element={<CommunityStats />} />

        {/* Protected routes */}
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
        <Route
          path="/verify-pickup"
          element={
            <ProtectedRoute>
              <VerifyPickup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/impact/personal"
          element={
            <ProtectedRoute>
              <PersonalImpact />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingChatbot />
      {/* 🆕 ADD TOAST CONTAINER */}
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
