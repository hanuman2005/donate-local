import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const FlaggedContent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Filters
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");

  // Modal states
  const [selectedContent, setSelectedContent] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: null });
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContent = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getFlaggedContent({
          page,
          limit: 20,
          type: typeFilter,
          status: statusFilter,
        });
        setContent(response.data.content);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch flagged content"
        );
      } finally {
        setLoading(false);
      }
    },
    [typeFilter, statusFilter]
  );

  useEffect(() => {
    fetchContent(1);
  }, [fetchContent]);

  const handleRemove = async () => {
    if (!selectedContent || !actionReason) return;
    setActionLoading(true);

    try {
      await adminAPI.removeContent(selectedContent._id, {
        reason: actionReason,
        contentType: selectedContent.contentType,
      });
      setActionModal({ open: false, type: null });
      setSelectedContent(null);
      setActionReason("");
      fetchContent(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove content");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedContent) return;
    setActionLoading(true);

    try {
      await adminAPI.restoreContent(selectedContent._id, {
        notes: actionReason,
        contentType: selectedContent.contentType,
      });
      setActionModal({ open: false, type: null });
      setSelectedContent(null);
      setActionReason("");
      fetchContent(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to restore content");
    } finally {
      setActionLoading(false);
    }
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
    filters: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
    select: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      fontSize: "0.875rem",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "1rem",
    },
    card: {
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    cardImage: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      background: isDark ? "#334155" : "#f3f4f6",
    },
    cardBody: { padding: "1rem" },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.75rem",
    },
    cardTitle: {
      fontWeight: "600",
      fontSize: "1rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
      marginBottom: "0.25rem",
    },
    cardMeta: { fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#6b7280" },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
      display: "inline-block",
    },
    flagInfo: {
      background: isDark ? "#78350f" : "#fef3c7",
      borderRadius: "8px",
      padding: "0.75rem",
      marginBottom: "0.75rem",
    },
    flagLabel: {
      fontSize: "0.75rem",
      color: isDark ? "#fcd34d" : "#92400e",
      fontWeight: "500",
      marginBottom: "0.25rem",
    },
    flagReason: { fontSize: "0.875rem", color: isDark ? "#fde68a" : "#78350f" },
    reportCount: {
      fontSize: "0.75rem",
      color: isDark ? "#f87171" : "#dc2626",
      marginTop: "0.25rem",
    },
    ownerInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.75rem",
    },
    ownerAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: isDark ? "#475569" : "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: "600",
      color: isDark ? "#94a3b8" : "#6b7280",
      overflow: "hidden",
    },
    ownerAvatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    cardActions: {
      display: "flex",
      gap: "0.75rem",
      paddingTop: "0.75rem",
      borderTop: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
    },
    actionBtn: {
      flex: 1,
      padding: "0.625rem 0.75rem",
      border: "2px solid transparent",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.813rem",
      fontWeight: "600",
      transition: "all 0.2s",
      textAlign: "center",
    },
    removeBtn: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
      border: "2px solid #fca5a5",
    },
    restoreBtn: {
      background: isDark ? "#166534" : "#dcfce7",
      color: isDark ? "#86efac" : "#166534",
      border: "2px solid #86efac",
    },
    viewBtn: {
      background: isDark ? "#312e81" : "#e0e7ff",
      color: isDark ? "#c7d2fe" : "#3730a3",
      border: "2px solid #c7d2fe",
    },
    statusRemoved: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
    },
    statusPending: {
      background: isDark ? "#78350f" : "#fef3c7",
      color: isDark ? "#fcd34d" : "#92400e",
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
      maxWidth: "500px",
      maxHeight: "90vh",
      overflow: "auto",
      border: `1px solid ${isDark ? "#334155" : "#e5e7eb"}`,
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    modalPreview: { marginBottom: "1rem" },
    modalPreviewImage: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "8px",
      marginBottom: "0.75rem",
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
    contentCard: {
      background: isDark ? "#334155" : "#f9fafb",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
    },
  };

  if (loading && content.length === 0) {
    return <div style={styles.loading}>Loading flagged content...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Flagged Content ({pagination.total})</h2>
        <div style={styles.filters}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option value="listing">Listings</option>
            <option value="review">Reviews</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="pending">Pending Review</option>
            <option value="removed">Removed</option>
            <option value="restored">Restored</option>
            <option value="all">All Status</option>
          </select>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        {content.length === 0 ? (
          <div style={styles.noData}>No flagged content found</div>
        ) : (
          content.map((item) => (
            <div key={item._id} style={styles.card}>
              {item.images?.[0] && (
                <img src={item.images[0]} alt="" style={styles.cardImage} />
              )}
              {!item.images?.[0] && (
                <div
                  style={{
                    ...styles.cardImage,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                  }}
                >
                  📷 No image
                </div>
              )}

              <div style={styles.cardBody}>
                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.cardTitle}>
                      {item.title || "Untitled"}
                    </div>
                    <div style={styles.cardMeta}>{item.contentType}</div>
                  </div>
                  <span
                    style={{
                      ...styles.badge,
                      ...(item.status === "removed"
                        ? styles.statusRemoved
                        : styles.statusPending),
                    }}
                  >
                    {item.status}
                  </span>
                </div>

                <div style={styles.flagInfo}>
                  <div style={styles.flagLabel}>⚠️ Flag Reason</div>
                  <div style={styles.flagReason}>
                    {item.flagReason || "Multiple reports received"}
                  </div>
                  <div style={styles.reportCount}>
                    📊 {item.reportCount || 0} reports
                  </div>
                </div>

                {item.owner && (
                  <div style={styles.ownerInfo}>
                    <div style={styles.ownerAvatar}>
                      {item.owner.avatar ? (
                        <img
                          src={item.owner.avatar}
                          alt=""
                          style={styles.ownerAvatarImg}
                        />
                      ) : (
                        item.owner.firstName?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                        {item.owner.firstName} {item.owner.lastName}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {item.owner.email}
                      </div>
                    </div>
                  </div>
                )}

                <div style={styles.cardActions}>
                  {item.status !== "removed" ? (
                    <button
                      style={{ ...styles.actionBtn, ...styles.removeBtn }}
                      onClick={() => {
                        setSelectedContent(item);
                        setActionModal({ open: true, type: "remove" });
                      }}
                    >
                      🗑️ Remove
                    </button>
                  ) : (
                    <button
                      style={{ ...styles.actionBtn, ...styles.restoreBtn }}
                      onClick={() => {
                        setSelectedContent(item);
                        setActionModal({ open: true, type: "restore" });
                      }}
                    >
                      ↩️ Restore
                    </button>
                  )}
                  <button
                    style={{ ...styles.actionBtn, ...styles.viewBtn }}
                    onClick={() => setSelectedContent(item)}
                  >
                    👁️ Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            onClick={() => fetchContent(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem 1rem" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={styles.pageBtn}
            onClick={() => fetchContent(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && selectedContent && (
        <div
          style={styles.modal}
          onClick={() => setActionModal({ open: false, type: null })}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {actionModal.type === "remove"
                ? "🗑️ Remove Content"
                : "↩️ Restore Content"}
            </h3>

            <div style={styles.modalPreview}>
              {selectedContent.images?.[0] && (
                <img
                  src={selectedContent.images[0]}
                  alt=""
                  style={styles.modalPreviewImage}
                />
              )}
              <div style={styles.contentCard}>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                  {selectedContent.title}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {selectedContent.description?.substring(0, 150)}...
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                {actionModal.type === "remove"
                  ? "Reason for removal *"
                  : "Notes (optional)"}
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder={
                  actionModal.type === "remove"
                    ? "Explain why this content is being removed..."
                    : "Add any notes about this restoration..."
                }
                style={styles.textarea}
              />
            </div>

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
                    actionModal.type === "remove" ? "#ef4444" : "#22c55e",
                }}
                onClick={
                  actionModal.type === "remove" ? handleRemove : handleRestore
                }
                disabled={
                  actionLoading ||
                  (actionModal.type === "remove" && !actionReason)
                }
              >
                {actionLoading
                  ? "Processing..."
                  : actionModal.type === "remove"
                  ? "Remove Content"
                  : "Restore Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedContent;
