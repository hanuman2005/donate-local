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
  useTheme();
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
      background: "var(--bg-primary)",
    },
    header: {
      background: "var(--gradient-primary)",
      padding: "1.5rem 2rem",
      color: "var(--text-button)",
      boxShadow: "var(--shadow-md)",
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
      background: "var(--badge-admin-bg)",
      padding: "0.5rem 1rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    nav: {
      background: "var(--bg-card)",
      borderBottom: "1px solid var(--border-color)",
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
      color: "var(--text-secondary)",
      borderBottom: "3px solid transparent",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    },
    tabActive: {
      color: "var(--primary)",
      borderBottomColor: "var(--primary)",
      background: "var(--bg-tab-active)",
    },
    main: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "1.5rem",
    },
    content: {
      background: "var(--bg-card)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-md)",
      minHeight: "500px",
    },
  };

  if (!user) {
    return (
      <div
        style={{
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-primary)",
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
