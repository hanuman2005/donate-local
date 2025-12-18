import React, { useState } from "react";
import Reports from "./components/Reports";
import Verifications from "./components/Verifications";
import Users from "./components/Users";
import Analytics from "./components/Analytics";
import FlaggedContent from "./components/FlaggedContent";
import Logs from "./components/Logs";

const TABS = [
  { label: "Reports", component: <Reports /> },
  { label: "Verifications", component: <Verifications /> },
  { label: "Users", component: <Users /> },
  { label: "Analytics", component: <Analytics /> },
  { label: "Flagged Content", component: <FlaggedContent /> },
  { label: "Logs", component: <Logs /> },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Admin Dashboard</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: "0.5rem 1.5rem",
              borderRadius: 6,
              border:
                idx === activeTab ? "2px solid #667eea" : "1px solid #ccc",
              background: idx === activeTab ? "#f5f7ff" : "#fff",
              fontWeight: idx === activeTab ? 700 : 400,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
          padding: 24,
          minHeight: 400,
        }}
      >
        {TABS[activeTab].component}
      </div>
    </div>
  );
};

export default AdminDashboard;
