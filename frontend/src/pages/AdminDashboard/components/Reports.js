import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusCounts, setStatusCounts] = useState({});
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filters
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Modal states
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolveModal, setResolveModal] = useState(false);
  const [resolution, setResolution] = useState("no_action");
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getAllReports({
          page,
          limit: 20,
          status: statusFilter,
          type: typeFilter,
          priority: priorityFilter,
        });
        setReports(response.data.reports);
        setPagination(response.data.pagination);
        setStatusCounts(response.data.statusCounts || {});
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, typeFilter, priorityFilter]
  );

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  const handleResolve = async () => {
    if (!selectedReport) return;
    setActionLoading(true);

    try {
      await adminAPI.resolveReport(selectedReport._id, {
        resolution,
        adminNotes,
      });
      setResolveModal(false);
      setSelectedReport(null);
      setResolution("no_action");
      setAdminNotes("");
      fetchReports(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve report");
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: { bg: "var(--bg-error)", text: "var(--danger)" },
      high: { bg: "var(--bg-warning)", text: "var(--warning)" },
      medium: { bg: "var(--bg-secondary)", text: "var(--secondary)" },
      low: { bg: "var(--bg-success)", text: "var(--success)" },
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "var(--bg-warning)", text: "var(--warning)" },
      reviewing: { bg: "var(--bg-info)", text: "var(--info)" },
      resolved: { bg: "var(--bg-success)", text: "var(--success)" },
      dismissed: { bg: "var(--bg-card)", text: "var(--text-secondary)" },
    };
    return colors[status] || colors.pending;
  };

  const getReasonLabel = (reason) => {
    const labels = {
      spam: "🗑️ Spam",
      fraud: "⚠️ Fraud",
      inappropriate_content: "🚫 Inappropriate",
      misleading_information: "📝 Misleading",
      unsafe_item: "☢️ Unsafe Item",
      harassment: "😡 Harassment",
      fake_listing: "❌ Fake Listing",
      other: "📋 Other",
    };
    return labels[reason] || reason;
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
      color: "var(--text-primary)",
    },
    statusTabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1rem",
      flexWrap: "wrap",
    },
    statusTab: {
      padding: "0.625rem 1.25rem",
      border: "2px solid var(--border-color)",
      borderRadius: "8px",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
    },
    statusTabActive: {
      background: "var(--primary)",
      color: "var(--text-on-primary)",
      borderColor: "var(--primary)",
    },
    count: {
      background: "var(--bg-badge)",
      padding: "0.125rem 0.625rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "700",
    },
    filters: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
    select: {
      padding: "0.5rem 1rem",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "0.875rem",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "var(--bg-card)",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "var(--shadow-md)",
    },
    th: {
      padding: "1rem",
      textAlign: "left",
      background: "var(--bg-primary)",
      fontWeight: "600",
      fontSize: "0.75rem",
      textTransform: "uppercase",
      color: "var(--text-secondary)",
      borderBottom: "1px solid var(--border-color)",
    },
    td: {
      padding: "1rem",
      borderBottom: "1px solid var(--border-color)",
      color: "var(--text-primary)",
      fontSize: "0.875rem",
      verticalAlign: "top",
    },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
      display: "inline-block",
      background: "var(--bg-badge)",
      color: "var(--text-badge)",
    },
    reportInfo: { maxWidth: "300px" },
    reportMessage: {
      fontSize: "0.75rem",
      color: "var(--text-secondary)",
      marginTop: "0.25rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    targetInfo: { display: "flex", alignItems: "center", gap: "0.5rem" },
    targetImage: {
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      objectFit: "cover",
      background: "var(--bg-primary)",
    },
    actionBtn: {
      padding: "0.5rem 1rem",
      border: "2px solid transparent",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.813rem",
      fontWeight: "600",
      transition: "all 0.2s",
      minWidth: "70px",
      textAlign: "center",
    },
    resolveBtn: {
      background: "var(--primary)",
      color: "var(--text-on-primary)",
      border: "2px solid var(--primary-dark)",
    },
    dismissBtn: {
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      border: "2px solid var(--border-color)",
    },
    viewBtn: {
      background: "var(--bg-info)",
      color: "var(--info)",
      border: "2px solid var(--info)",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1.5rem",
    },
    pageBtn: {
      padding: "0.5rem 1rem",
      border: "1px solid var(--border-color)",
      borderRadius: "6px",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      cursor: "pointer",
    },
    pageBtnActive: {
      background: "var(--primary)",
      color: "var(--text-on-primary)",
      borderColor: "var(--primary)",
    },
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      borderRadius: "12px",
      padding: "1.5rem",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflow: "auto",
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "var(--text-primary)",
    },
    formGroup: { marginBottom: "1rem" },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      fontSize: "0.875rem",
      color: "var(--text-primary)",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      fontSize: "0.875rem",
      minHeight: "100px",
      resize: "vertical",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
    },
    radioGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
    radioOption: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      cursor: "pointer",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
    },
    radioOptionSelected: {
      borderColor: "var(--primary)",
      background: "var(--bg-primary)",
    },
    modalActions: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
      marginTop: "1.5rem",
    },
    cancelBtn: {
      padding: "0.625rem 1.25rem",
      border: "2px solid var(--border-color)",
      borderRadius: "8px",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
    },
    confirmBtn: {
      padding: "0.625rem 1.25rem",
      border: "2px solid transparent",
      borderRadius: "8px",
      background: "var(--primary)",
      color: "var(--text-on-primary)",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
    },
    error: {
      background: "var(--bg-error)",
      color: "var(--text-error)",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    loading: {
      textAlign: "center",
      padding: "3rem",
      color: "var(--text-secondary)",
    },
    noData: {
      textAlign: "center",
      padding: "3rem",
      color: "var(--text-secondary)",
    },
    detailCard: {
      background: "var(--bg-card)",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.5rem",
      fontSize: "0.875rem",
    },
    detailLabel: { color: "var(--text-secondary)" },
    detailValue: { fontWeight: "500", color: "var(--text-primary)" },
  };

  const resolutionOptions = [
    {
      value: "no_action",
      label: "No Action Required",
      desc: "Report reviewed, no violation found",
    },
    {
      value: "warning_sent",
      label: "Warning Sent",
      desc: "User/listing owner warned",
    },
    {
      value: "content_removed",
      label: "Content Removed",
      desc: "Listing or review removed",
    },
    {
      value: "account_suspended",
      label: "Account Suspended",
      desc: "User account suspended",
    },
    { value: "other", label: "Other", desc: "Custom resolution" },
  ];

  if (loading && reports.length === 0) {
    return <div style={styles.loading}>Loading reports...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Reports Management</h2>
        <div style={styles.filters}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option value="listing">Listing Reports</option>
            <option value="user">User Reports</option>
            <option value="review">Review Reports</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={styles.statusTabs}>
        {["pending", "reviewing", "resolved", "dismissed", "all"].map(
          (status) => (
            <button
              key={status}
              style={{
                ...styles.statusTab,
                ...(statusFilter === status ? styles.statusTabActive : {}),
              }}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {statusCounts[status] !== undefined && (
                <span style={styles.count}>{statusCounts[status]}</span>
              )}
            </button>
          )
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Report</th>
            <th style={styles.th}>Target</th>
            <th style={styles.th}>Reported By</th>
            <th style={styles.th}>Priority</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan={7} style={styles.noData}>
                No reports found
              </td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report._id}>
                <td style={styles.td}>
                  <div style={styles.reportInfo}>
                    <div style={{ fontWeight: "500" }}>
                      {getReasonLabel(report.reason)}
                    </div>
                    <div style={styles.reportMessage}>{report.message}</div>
                  </div>
                </td>
                <td style={styles.td}>
                  <div style={styles.targetInfo}>
                    {report.reportType === "listing" && report.listing ? (
                      <>
                        {report.listing.images?.[0] && (
                          <img
                            src={report.listing.images[0]}
                            alt=""
                            style={styles.targetImage}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: "500" }}>
                            {report.listing.title}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#6b7280" }}
                          >
                            Listing
                          </div>
                        </div>
                      </>
                    ) : report.reportType === "user" && report.user ? (
                      <div>
                        <div style={{ fontWeight: "500" }}>
                          {report.user.firstName} {report.user.lastName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          User
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>N/A</span>
                    )}
                  </div>
                </td>
                <td style={styles.td}>
                  {report.reportedBy ? (
                    <div>
                      <div>
                        {report.reportedBy.firstName}{" "}
                        {report.reportedBy.lastName}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {report.reportedBy.email}
                      </div>
                    </div>
                  ) : (
                    <span style={{ color: "#9ca3af" }}>Unknown</span>
                  )}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: getPriorityColor(report.priority).bg,
                      color: getPriorityColor(report.priority).text,
                    }}
                  >
                    {report.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: getStatusColor(report.status).bg,
                      color: getStatusColor(report.status).text,
                    }}
                  >
                    {report.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {report.status === "pending" ||
                  report.status === "reviewing" ? (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{ ...styles.actionBtn, ...styles.resolveBtn }}
                        onClick={() => {
                          setSelectedReport(report);
                          setResolveModal(true);
                        }}
                      >
                        Resolve
                      </button>
                    </div>
                  ) : (
                    <button
                      style={{ ...styles.actionBtn, ...styles.viewBtn }}
                      onClick={() => setSelectedReport(report)}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            onClick={() => fetchReports(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem 1rem" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={styles.pageBtn}
            onClick={() => fetchReports(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && selectedReport && (
        <div style={styles.modal} onClick={() => setResolveModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>📋 Resolve Report</h3>

            <div style={styles.detailCard}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Reason:</span>
                <span style={styles.detailValue}>
                  {getReasonLabel(selectedReport.reason)}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Type:</span>
                <span style={styles.detailValue}>
                  {selectedReport.reportType}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Priority:</span>
                <span
                  style={{
                    ...styles.badge,
                    background: getPriorityColor(selectedReport.priority).bg,
                    color: getPriorityColor(selectedReport.priority).text,
                  }}
                >
                  {selectedReport.priority}
                </span>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <span style={styles.detailLabel}>Message:</span>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
                  {selectedReport.message}
                </p>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Resolution</label>
              <div style={styles.radioGroup}>
                {resolutionOptions.map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      ...styles.radioOption,
                      ...(resolution === opt.value
                        ? styles.radioOptionSelected
                        : {}),
                    }}
                  >
                    <input
                      type="radio"
                      name="resolution"
                      value={opt.value}
                      checked={resolution === opt.value}
                      onChange={(e) => setResolution(e.target.value)}
                    />
                    <div>
                      <div style={{ fontWeight: "500" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {opt.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Admin Notes (optional)</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this resolution..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setResolveModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.confirmBtn,
                  background:
                    resolution === "account_suspended"
                      ? "#ef4444"
                      : resolution === "content_removed"
                      ? "#f59e0b"
                      : "#22c55e",
                }}
                onClick={handleResolve}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
