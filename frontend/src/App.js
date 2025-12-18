import AdminDashboard from "./pages/AdminDashboard";
// src/App.js 
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import FloatingChatbot from "./components/Common/FloatingChatbot";
import LiveNotificationBanner from "./components/Dashboard/LiveNotificationBanner";

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
import WasteAnalyzer from "./pages/WasteAnalyzer";
import AnalysisHistory from "./pages/AnalysisHistory";
import MyPickups from "./pages/MyPickups";
import RouteOptimizer from "./pages/RouteOptimizer";
import DigitalTwin from "./pages/DigitalTwin";

import Chat from "./components/Chat";
import ContactModal from "./components/Modals/ContactModal";

// Impact Pages
import CheckIn from "./components/QR/checkIn";
import PersonalImpact from "./components/ImpactDashboard/PersonalImpact";
import CommunityStats from "./components/ImpactDashboard/CommunityStats";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* ✅ WRAP Routes inside Sidebar */}
      <Sidebar>
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

          {/* Profile */}
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

          {/* Schedules */}
          <Route
            path="/schedules"
            element={
              <ProtectedRoute>
                <SchedulesPage />
              </ProtectedRoute>
            }
          />

          {/* AI Features */}
          <Route
            path="/waste-analyzer"
            element={
              <ProtectedRoute>
                <WasteAnalyzer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis-history"
            element={
              <ProtectedRoute>
                <AnalysisHistory />
              </ProtectedRoute>
            }
          />
          <Route path="/route-optimizer" element={<RouteOptimizer />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />

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
          <Route
            path="/my-pickups"
            element={
              <ProtectedRoute>
                <MyPickups />
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
      </Sidebar>

      {/* FloatingChatbot outside Sidebar so it appears on all pages */}
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
