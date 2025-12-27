import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const Logs = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const fetchLogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 30 };
        if (actionFilter) params.action = actionFilter;
        if (dateRange.start) params.startDate = dateRange.start;
        if (dateRange.end) params.endDate = dateRange.end;

        const response = await adminAPI.getLogs(params);
        setLogs(response.data.logs);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    },
    [actionFilter, dateRange]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const getActionIcon = (action) => {
    const icons = {
      suspend_user: "🚫",
      unsuspend_user: "✅",
      warn_user: "⚠️",
      update_role: "👤",
      approve_verification: "✓",
      reject_verification: "✗",
      remove_content: "🗑️",
      restore_content: "↩️",
      resolve_report: "📋",
      bulk_suspend: "🚫",
      bulk_unsuspend: "✅",
      bulk_warn: "⚠️",
    };
    return icons[action] || "📝";
  };

  const getActionColor = (action) => {
    if (
      action.includes("suspend") ||
      action.includes("remove") ||
      action.includes("reject")
    ) {
      return {
        bg: isDark ? "#7f1d1d" : "#fee2e2",
        text: isDark ? "#fca5a5" : "#991b1b",
      };
    }
    if (
      action.includes("approve") ||
      action.includes("restore") ||
      action.includes("unsuspend")
    ) {
      return {
        bg: isDark ? "#166534" : "#dcfce7",
        text: isDark ? "#86efac" : "#166534",
      };
    }
    if (action.includes("warn")) {
      return {
        bg: isDark ? "#78350f" : "#fef3c7",
        text: isDark ? "#fcd34d" : "#92400e",
      };
    }
    return {
      bg: isDark ? "#312e81" : "#e0e7ff",
      text: isDark ? "#c7d2fe" : "#3730a3",
    };
  };

  const formatAction = (action) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const styles = {
    container: { padding: "1rem" },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    filters: {
      display: "flex",
      gap: "0.75rem",
      flexWrap: "wrap",
      alignItems: "center",
    },
    input: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    select: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
    },
    timeline: { position: "relative", paddingLeft: "2rem" },
    timelineLine: {
      position: "absolute",
      left: "0.75rem",
      top: 0,
      bottom: 0,
      width: "2px",
      background: isDark ? "#475569" : "#e5e7eb",
    },
    logEntry: {
      position: "relative",
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    logDot: {
      position: "absolute",
      left: "-1.75rem",
      top: "1.25rem",
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      background: "#667eea",
      border: `2px solid ${isDark ? "#1e293b" : "#fff"}`,
      boxShadow: "0 0 0 2px #667eea",
    },
    logHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.5rem",
    },
    logAction: { display: "flex", alignItems: "center", gap: "0.5rem" },
    actionIcon: { fontSize: "1.25rem" },
    actionBadge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    logTime: { fontSize: "0.75rem", color: isDark ? "#64748b" : "#9ca3af" },
    logDetails: { fontSize: "0.875rem", color: isDark ? "#94a3b8" : "#4b5563" },
    logAdmin: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.75rem",
      paddingTop: "0.75rem",
      borderTop: `1px solid ${isDark ? "#334155" : "#f3f4f6"}`,
    },
    adminAvatar: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      background: isDark ? "#475569" : "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.625rem",
      fontWeight: "600",
      color: isDark ? "#94a3b8" : "#6b7280",
    },
    adminName: { fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#6b7280" },
    targetInfo: {
      marginTop: "0.5rem",
      padding: "0.5rem",
      background: isDark ? "#334155" : "#f9fafb",
      borderRadius: "6px",
      fontSize: "0.75rem",
      color: isDark ? "#e2e8f0" : "#374151",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
    pageBtn: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "6px",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
    },
    error: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    loading: {
      textAlign: "center",
      padding: "3rem",
      color: isDark ? "#94a3b8" : "#6b7280",
    },
    noData: {
      textAlign: "center",
      padding: "3rem",
      color: isDark ? "#64748b" : "#9ca3af",
    },
    statsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    statCard: {
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "8px",
      padding: "1rem",
      textAlign: "center",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    statValue: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    statLabel: { fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#6b7280" },
  };

  const actionOptions = [
    { value: "", label: "All Actions" },
    { value: "suspend", label: "Suspensions" },
    { value: "unsuspend", label: "Unsuspensions" },
    { value: "warn", label: "Warnings" },
    { value: "verification", label: "Verifications" },
    { value: "content", label: "Content Moderation" },
    { value: "role", label: "Role Changes" },
  ];

  if (loading && logs.length === 0) {
    return <div style={styles.loading}>Loading admin logs...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Activity Logs</h2>
        <div style={styles.filters}>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={styles.select}
          >
            {actionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            style={styles.input}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            style={styles.input}
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{pagination.total}</div>
          <div style={styles.statLabel}>Total Actions</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: "#ef4444" }}>
            {
              logs.filter(
                (l) =>
                  l.action.includes("suspend") &&
                  !l.action.includes("unsuspend")
              ).length
            }
          </div>
          <div style={styles.statLabel}>Suspensions (shown)</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: "#f59e0b" }}>
            {logs.filter((l) => l.action.includes("warn")).length}
          </div>
          <div style={styles.statLabel}>Warnings (shown)</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statValue, color: "#22c55e" }}>
            {logs.filter((l) => l.action.includes("approve")).length}
          </div>
          <div style={styles.statLabel}>Approvals (shown)</div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Timeline */}
      <div style={styles.timeline}>
        <div style={styles.timelineLine} />

        {logs.length === 0 ? (
          <div style={styles.noData}>No logs found</div>
        ) : (
          logs.map((log) => {
            const actionColor = getActionColor(log.action);
            return (
              <div key={log._id} style={styles.logEntry}>
                <div
                  style={{ ...styles.logDot, background: actionColor.text }}
                />

                <div style={styles.logHeader}>
                  <div style={styles.logAction}>
                    <span style={styles.actionIcon}>
                      {getActionIcon(log.action)}
                    </span>
                    <span
                      style={{
                        ...styles.actionBadge,
                        background: actionColor.bg,
                        color: actionColor.text,
                      }}
                    >
                      {formatAction(log.action)}
                    </span>
                  </div>
                  <span style={styles.logTime}>
                    {formatDate(log.createdAt)}
                  </span>
                </div>

                {log.details && (
                  <div style={styles.logDetails}>
                    {log.details.reason && (
                      <div>Reason: {log.details.reason}</div>
                    )}
                    {log.details.days && (
                      <div>Duration: {log.details.days} days</div>
                    )}
                    {log.details.oldRole && log.details.newRole && (
                      <div>
                        Role: {log.details.oldRole} → {log.details.newRole}
                      </div>
                    )}
                    {log.details.userIds && (
                      <div>Affected users: {log.details.userIds.length}</div>
                    )}
                  </div>
                )}

                {log.targetType && log.targetId && (
                  <div style={styles.targetInfo}>
                    <strong>Target:</strong> {log.targetType} (
                    {log.targetId.toString().slice(-8)})
                  </div>
                )}

                <div style={styles.logAdmin}>
                  <div style={styles.adminAvatar}>
                    {log.admin?.firstName?.[0]?.toUpperCase() || "A"}
                  </div>
                  <span style={styles.adminName}>
                    {log.admin?.firstName} {log.admin?.lastName} (
                    {log.admin?.email})
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            onClick={() => fetchLogs(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem 1rem" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={styles.pageBtn}
            onClick={() => fetchLogs(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
