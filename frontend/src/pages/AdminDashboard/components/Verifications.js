import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const Verifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filters
  const [statusFilter, setStatusFilter] = useState("pending");

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: null });
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVerifications = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getVerifications({
          page,
          limit: 20,
          status: statusFilter,
        });
        setVerifications(response.data.verifications);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch verifications"
        );
      } finally {
        setLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    fetchVerifications(1);
  }, [fetchVerifications]);

  const handleApprove = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      await adminAPI.approveVerification(selectedUser._id, { notes });
      setActionModal({ open: false, type: null });
      setSelectedUser(null);
      setNotes("");
      fetchVerifications(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve verification");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectReason) return;
    setActionLoading(true);

    try {
      await adminAPI.rejectVerification(selectedUser._id, {
        reason: rejectReason,
      });
      setActionModal({ open: false, type: null });
      setSelectedUser(null);
      setRejectReason("");
      fetchVerifications(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject verification");
    } finally {
      setActionLoading(false);
    }
  };

  const getVerificationStatusIcon = (status) => {
    return status ? "✅" : "⏳";
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
    statusTabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
    statusTab: {
      padding: "0.5rem 1.5rem",
      border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
      borderRadius: "8px",
      background: isDark ? "#334155" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
      fontSize: "0.875rem",
    },
    statusTabActive: {
      background: "#667eea",
      color: "#fff",
      borderColor: "#667eea",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "1rem",
    },
    card: {
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
    },
    avatar: {
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      background: isDark ? "#475569" : "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      color: isDark ? "#94a3b8" : "#6b7280",
      fontSize: "1.25rem",
      overflow: "hidden",
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    userInfo: { flex: 1 },
    userName: {
      fontWeight: "600",
      fontSize: "1rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    userEmail: { fontSize: "0.875rem", color: isDark ? "#94a3b8" : "#6b7280" },
    trustScore: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    trustBar: {
      width: "80px",
      height: "8px",
      background: isDark ? "#475569" : "#e5e7eb",
      borderRadius: "4px",
      overflow: "hidden",
    },
    verificationStatus: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0.5rem",
      marginBottom: "1rem",
      padding: "0.75rem",
      background: isDark ? "#334155" : "#f9fafb",
      borderRadius: "8px",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    statusItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.875rem",
    },
    cardFooter: {
      display: "flex",
      gap: "0.75rem",
      paddingTop: "1rem",
      borderTop: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
    },
    actionBtn: {
      flex: 1,
      padding: "0.75rem 1rem",
      border: "2px solid transparent",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: "600",
      transition: "all 0.2s",
      textAlign: "center",
    },
    approveBtn: {
      background: isDark ? "#166534" : "#dcfce7",
      color: isDark ? "#86efac" : "#166534",
      border: "2px solid #86efac",
    },
    rejectBtn: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
      border: "2px solid #fca5a5",
    },
    joinedDate: {
      fontSize: "0.75rem",
      color: isDark ? "#94a3b8" : "#9ca3af",
      marginTop: "0.25rem",
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
    modal: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      width: "90%",
      maxWidth: "450px",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    formGroup: { marginBottom: "1rem" },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      fontSize: "0.875rem",
      color: isDark ? "#e2e8f0" : "#374151",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      minHeight: "100px",
      resize: "vertical",
      background: isDark ? "#0f172a" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    modalActions: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "flex-end",
      marginTop: "1.5rem",
    },
    cancelBtn: {
      padding: "0.625rem 1.25rem",
      border: `2px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      background: isDark ? "#334155" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
    },
    confirmBtn: {
      padding: "0.625rem 1.25rem",
      border: "2px solid #667eea",
      borderRadius: "8px",
      background: "#667eea",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
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
      gridColumn: "1 / -1",
    },
    userCard: {
      background: isDark ? "#334155" : "#f9fafb",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
    },
  };

  if (loading && verifications.length === 0) {
    return <div style={styles.loading}>Loading verification requests...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Verifications ({pagination.total})</h2>
      </div>

      {/* Status Tabs */}
      <div style={styles.statusTabs}>
        {["pending", "approved", "rejected", "all"].map((status) => (
          <button
            key={status}
            style={{
              ...styles.statusTab,
              ...(statusFilter === status ? styles.statusTabActive : {}),
            }}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {verifications.length === 0 ? (
          <div style={styles.noData}>No verification requests found</div>
        ) : (
          verifications.map((verification) => (
            <div key={verification._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {verification.user.avatar ? (
                    <img
                      src={verification.user.avatar}
                      alt=""
                      style={styles.avatarImg}
                    />
                  ) : (
                    verification.user.firstName?.[0]?.toUpperCase() || "?"
                  )}
                </div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>
                    {verification.user.firstName} {verification.user.lastName}
                  </div>
                  <div style={styles.userEmail}>{verification.user.email}</div>
                  <div style={styles.joinedDate}>
                    Joined:{" "}
                    {new Date(verification.requestedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={styles.verificationStatus}>
                <div style={styles.statusItem}>
                  {getVerificationStatusIcon(
                    verification.verificationStatus?.email
                  )}{" "}
                  Email
                </div>
                <div style={styles.statusItem}>
                  {getVerificationStatusIcon(
                    verification.verificationStatus?.phone
                  )}{" "}
                  Phone
                </div>
                <div style={styles.statusItem}>
                  {getVerificationStatusIcon(
                    verification.verificationStatus?.identity
                  )}{" "}
                  Identity
                </div>
                <div style={styles.statusItem}>
                  {getVerificationStatusIcon(
                    verification.verificationStatus?.address
                  )}{" "}
                  Address
                </div>
              </div>

              <div style={styles.trustScore}>
                <span>Trust Score:</span>
                <div style={styles.trustBar}>
                  <div
                    style={{
                      width: `${verification.trustScore || 50}%`,
                      height: "100%",
                      background:
                        (verification.trustScore || 50) >= 70
                          ? "#22c55e"
                          : (verification.trustScore || 50) >= 40
                          ? "#f59e0b"
                          : "#ef4444",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <span style={{ fontWeight: "600" }}>
                  {verification.trustScore || 50}
                </span>
              </div>

              {verification.status === "pending" && (
                <div style={styles.cardFooter}>
                  <button
                    style={{ ...styles.actionBtn, ...styles.approveBtn }}
                    onClick={() => {
                      setSelectedUser(verification);
                      setActionModal({ open: true, type: "approve" });
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    style={{ ...styles.actionBtn, ...styles.rejectBtn }}
                    onClick={() => {
                      setSelectedUser(verification);
                      setActionModal({ open: true, type: "reject" });
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>
              )}

              {verification.status === "approved" && (
                <div style={{ ...styles.cardFooter, justifyContent: "center" }}>
                  <span style={{ color: "#166534", fontWeight: "500" }}>
                    ✅ Verified
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            onClick={() => fetchVerifications(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem 1rem" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={styles.pageBtn}
            onClick={() => fetchVerifications(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && selectedUser && (
        <div
          style={styles.modal}
          onClick={() => setActionModal({ open: false, type: null })}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {actionModal.type === "approve"
                ? "✅ Approve Verification"
                : "❌ Reject Verification"}
            </h3>

            <div style={styles.userCard}>
              <div style={{ fontWeight: "500" }}>
                {selectedUser.user.firstName} {selectedUser.user.lastName}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {selectedUser.user.email}
              </div>
            </div>

            {actionModal.type === "approve" ? (
              <div style={styles.formGroup}>
                <label style={styles.label}>Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  style={styles.textarea}
                />
              </div>
            ) : (
              <div style={styles.formGroup}>
                <label style={styles.label}>Rejection Reason *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this verification is being rejected..."
                  style={styles.textarea}
                />
              </div>
            )}

            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setActionModal({ open: false, type: null })}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.confirmBtn,
                  background:
                    actionModal.type === "approve" ? "#22c55e" : "#ef4444",
                }}
                onClick={
                  actionModal.type === "approve" ? handleApprove : handleReject
                }
                disabled={
                  actionLoading ||
                  (actionModal.type === "reject" && !rejectReason)
                }
              >
                {actionLoading
                  ? "Processing..."
                  : actionModal.type === "approve"
                  ? "Approve"
                  : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verifications;
