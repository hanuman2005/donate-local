import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Reports from "./components/Reports";
import Verifications from "./components/Verifications";
import Users from "./components/Users";
import Analytics from "./components/Analytics";
import FlaggedContent from "./components/FlaggedContent";
import Logs from "./components/Logs";

const TABS = [
  { label: "📊 Analytics", key: "analytics", component: Analytics },
  { label: "👥 Users", key: "users", component: Users },
  { label: "⚠️ Reports", key: "reports", component: Reports },
  { label: "✓ Verifications", key: "verifications", component: Verifications },
  { label: "🚩 Flagged", key: "flagged", component: FlaggedContent },
  { label: "📜 Logs", key: "logs", component: Logs },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (user && user.userType !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const ActiveComponent = TABS[activeTab].component;

  const styles = {
    container: {
      minHeight: "100vh",
      background: isDark ? "#0f172a" : "#f3f4f6",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1.5rem 2rem",
      color: "#fff",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    },
    headerContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    subtitle: {
      fontSize: "0.875rem",
      opacity: 0.9,
      marginTop: "0.25rem",
    },
    adminBadge: {
      background: "rgba(255,255,255,0.2)",
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    nav: {
      background: isDark ? "#1e293b" : "#fff",
      borderBottom: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
    },
    navContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      gap: "0.25rem",
      padding: "0 1rem",
      overflowX: "auto",
    },
    tab: {
      padding: "1rem 1.5rem",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: isDark ? "#94a3b8" : "#6b7280",
      borderBottom: "3px solid transparent",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    },
    tabActive: {
      color: "#667eea",
      borderBottomColor: "#667eea",
      background: isDark ? "#1e3a5f" : "#f0f9ff",
    },
    main: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "1.5rem",
    },
    content: {
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      minHeight: "500px",
    },
  };

  if (!user) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: isDark ? "#f1f5f9" : "#1f2937",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>🛡️ Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Manage users, reports, and platform settings
            </p>
          </div>
          <div style={styles.adminBadge}>
            <span>👤</span>
            <span>
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          {TABS.map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(idx)}
              style={{
                ...styles.tab,
                ...(idx === activeTab ? styles.tabActive : {}),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
