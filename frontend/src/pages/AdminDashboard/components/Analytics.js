import React, { useState, useEffect } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const styles = {
    container: { padding: "1rem" },
    header: { marginBottom: "1.5rem" },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "var(--text-primary)",
    },
    subtitle: {
      color: "var(--text-secondary)",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    statCard: {
      background: "var(--bg-card)",
      borderRadius: "12px",
      padding: "1.25rem",
      boxShadow: "var(--shadow-md)",
      border: "1px solid var(--border-color)",
    },
    statIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
      marginBottom: "0.75rem",
      background: "var(--bg-primary)",
      color: "var(--primary)",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "var(--text-primary)",
      lineHeight: 1,
    },
    statLabel: {
      fontSize: "0.875rem",
      color: "var(--text-secondary)",
      marginTop: "0.25rem",
    },
    statChange: {
      fontSize: "0.75rem",
      marginTop: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },
    statChangeUp: { color: "var(--success)" },
    statChangeDown: { color: "var(--danger)" },
    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "var(--text-primary)",
    },
    recentSection: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      gap: "1.5rem",
    },
    recentCard: {
      background: "var(--bg-card)",
      borderRadius: "12px",
      padding: "1.25rem",
      boxShadow: "var(--shadow-md)",
    },
    recentList: { listStyle: "none", padding: 0, margin: 0 },
    recentItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.75rem 0",
      borderBottom: "1px solid var(--border-color)",
      color: "var(--text-primary)",
    },
    recentItemLast: { borderBottom: "none" },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
      background: "var(--bg-badge)",
      color: "var(--text-badge)",
    },
    loading: {
      textAlign: "center",
      padding: "3rem",
      color: "var(--text-secondary)",
    },
    error: {
      background: "var(--bg-error)",
      color: "var(--text-error)",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    metricsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    metricCard: {
      background: "var(--gradient-primary)",
      borderRadius: "12px",
      padding: "1.25rem",
      color: "var(--text-on-primary)",
    },
    metricValue: { fontSize: "1.75rem", fontWeight: "700" },
    metricLabel: { fontSize: "0.875rem", opacity: 0.9 },
    chartPlaceholder: {
      background: "var(--bg-card)",
      borderRadius: "12px",
      padding: "2rem",
      textAlign: "center",
      color: "var(--text-secondary)",
      marginBottom: "1.5rem",
    },
  };

  const getStatusColor = (status) => {
    const colors = {
      available: { bg: "var(--bg-success)", text: "var(--success)" },
      pending: { bg: "var(--bg-warning)", text: "var(--warning)" },
      completed: { bg: "var(--bg-info)", text: "var(--info)" },
      critical: { bg: "var(--bg-error)", text: "var(--danger)" },
      high: { bg: "var(--bg-warning)", text: "var(--warning)" },
      medium: { bg: "var(--bg-secondary)", text: "var(--secondary)" },
    };
    return (
      colors[status] || { bg: "var(--bg-card)", text: "var(--text-secondary)" }
    );
  };

  if (loading) {
    return <div style={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Platform Analytics</h2>
        <p style={styles.subtitle}>
          Overview of platform performance and metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{stats?.users?.total || 0}</div>
          <div style={styles.metricLabel}>Total Users</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{stats?.listings?.total || 0}</div>
          <div style={styles.metricLabel}>Total Listings</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>
            {stats?.listings?.completed || 0}
          </div>
          <div style={styles.metricLabel}>Completed Donations</div>
        </div>
        <div style={styles.metricCard}>
          <div style={styles.metricValue}>{stats?.reports?.pending || 0}</div>
          <div style={styles.metricLabel}>Pending Reports</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{stats?.users?.active || 0}</div>
          <div style={styles.statLabel}>Active Users</div>
          <div style={{ ...styles.statChange, ...styles.statChangeUp }}>
            ↑ {stats?.users?.newThisWeek || 0} this week
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚫</div>
          <div style={styles.statValue}>{stats?.users?.suspended || 0}</div>
          <div style={styles.statLabel}>Suspended Users</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statValue}>{stats?.listings?.active || 0}</div>
          <div style={styles.statLabel}>Active Listings</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div style={styles.statValue}>{stats?.listings?.flagged || 0}</div>
          <div style={styles.statLabel}>Flagged Listings</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✓</div>
          <div style={styles.statValue}>
            {stats?.verifications?.pending || 0}
          </div>
          <div style={styles.statLabel}>Pending Verifications</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statValue}>{stats?.users?.growth || 0}%</div>
          <div style={styles.statLabel}>User Growth (30d)</div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div style={styles.chartPlaceholder}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
        <div>Growth charts coming soon</div>
        <div style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
          Integrate Chart.js or Recharts for visualization
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentSection}>
        <div style={styles.recentCard}>
          <h3 style={styles.sectionTitle}>📦 Recent Listings</h3>
          <ul style={styles.recentList}>
            {stats?.recentActivity?.listings?.length > 0 ? (
              stats.recentActivity.listings.map((listing, idx) => (
                <li
                  key={listing._id}
                  style={{
                    ...styles.recentItem,
                    ...(idx === stats.recentActivity.listings.length - 1
                      ? styles.recentItemLast
                      : {}),
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>{listing.title}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      by {listing.donor?.firstName} {listing.donor?.lastName}
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      background: getStatusColor(listing.status).bg,
                      color: getStatusColor(listing.status).text,
                    }}
                  >
                    {listing.status}
                  </span>
                </li>
              ))
            ) : (
              <li style={styles.recentItem}>No recent listings</li>
            )}
          </ul>
        </div>

        <div style={styles.recentCard}>
          <h3 style={styles.sectionTitle}>⚠️ Recent Reports</h3>
          <ul style={styles.recentList}>
            {stats?.recentActivity?.reports?.length > 0 ? (
              stats.recentActivity.reports.map((report, idx) => (
                <li
                  key={report._id}
                  style={{
                    ...styles.recentItem,
                    ...(idx === stats.recentActivity.reports.length - 1
                      ? styles.recentItemLast
                      : {}),
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>{report.reason}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {report.reportType} • by {report.reportedBy?.firstName}
                    </div>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      background: getStatusColor(report.priority).bg,
                      color: getStatusColor(report.priority).text,
                    }}
                  >
                    {report.priority}
                  </span>
                </li>
              ))
            ) : (
              <li style={styles.recentItem}>No recent reports</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
