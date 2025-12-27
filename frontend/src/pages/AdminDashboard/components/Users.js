import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../../services/api";
import { useTheme } from "../../../context/ThemeContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModal, setActionModal] = useState({ open: false, type: null });
  const [actionReason, setActionReason] = useState("");
  const [actionDays, setActionDays] = useState(30);
  const [actionLoading, setActionLoading] = useState(false);

  // Bulk selection
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getAllUsers({
          page,
          limit: 20,
          search,
          status: statusFilter,
          userType: userTypeFilter,
          sortBy,
          sortOrder,
        });
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter, userTypeFilter, sortBy, sortOrder]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const handleAction = async () => {
    if (!selectedUser || !actionModal.type) return;
    setActionLoading(true);

    try {
      if (actionModal.type === "suspend") {
        await adminAPI.suspendUser(selectedUser._id, {
          reason: actionReason,
          days: actionDays,
        });
      } else if (actionModal.type === "warn") {
        await adminAPI.warnUser(selectedUser._id, {
          reason: actionReason,
          type: "policy_violation",
        });
      } else if (actionModal.type === "unsuspend") {
        await adminAPI.unsuspendUser(selectedUser._id);
      }

      setActionModal({ open: false, type: null });
      setActionReason("");
      setSelectedUser(null);
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${selectedUsers.length} users?`
      )
    )
      return;

    setActionLoading(true);
    try {
      await adminAPI.bulkUserAction({
        userIds: selectedUsers,
        action,
        reason: "Bulk action by admin",
      });
      setSelectedUsers([]);
      fetchUsers(pagination.page);
    } catch (err) {
      setError(err.response?.data?.message || "Bulk action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u._id));
    }
  };

  const getTrustScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
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
    searchInput: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      minWidth: "250px",
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
    bulkActions: {
      display: "flex",
      gap: "0.5rem",
      padding: "0.75rem",
      background: isDark ? "#1e3a5f" : "#f0f9ff",
      borderRadius: "8px",
      marginBottom: "1rem",
      alignItems: "center",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: isDark
        ? "0 1px 3px rgba(0,0,0,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
    },
    th: {
      padding: "1rem",
      textAlign: "left",
      background: isDark ? "#334155" : "#f9fafb",
      fontWeight: "600",
      fontSize: "0.75rem",
      textTransform: "uppercase",
      color: isDark ? "#94a3b8" : "#6b7280",
      borderBottom: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
    },
    td: {
      padding: "1rem",
      borderBottom: `1px solid ${isDark ? "#334155" : "#f3f4f6"}`,
      color: isDark ? "#f1f5f9" : "#1f2937",
      fontSize: "0.875rem",
    },
    userInfo: { display: "flex", alignItems: "center", gap: "0.75rem" },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: isDark ? "#475569" : "#e5e7eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      color: isDark ? "#94a3b8" : "#6b7280",
      fontSize: "0.875rem",
      overflow: "hidden",
    },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    userName: { fontWeight: "500", color: isDark ? "#f1f5f9" : "#1f2937" },
    userEmail: { fontSize: "0.75rem", color: isDark ? "#94a3b8" : "#6b7280" },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
      display: "inline-block",
    },
    statusActive: {
      background: isDark ? "#166534" : "#dcfce7",
      color: isDark ? "#86efac" : "#166534",
    },
    statusSuspended: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
    },
    trustScore: { display: "flex", alignItems: "center", gap: "0.5rem" },
    trustBar: {
      width: "60px",
      height: "6px",
      background: isDark ? "#475569" : "#e5e7eb",
      borderRadius: "3px",
      overflow: "hidden",
    },
    actionBtn: {
      padding: "0.5rem 1rem",
      border: "2px solid transparent",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.813rem",
      fontWeight: "600",
      transition: "all 0.2s",
      minWidth: "80px",
      textAlign: "center",
    },
    warnBtn: {
      background: isDark ? "#78350f" : "#fef3c7",
      color: isDark ? "#fcd34d" : "#92400e",
      border: `2px solid ${isDark ? "#fcd34d" : "#fcd34d"}`,
    },
    suspendBtn: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
      border: "2px solid #fca5a5",
    },
    unsuspendBtn: {
      background: isDark ? "#166534" : "#dcfce7",
      color: isDark ? "#86efac" : "#166534",
      border: "2px solid #86efac",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
      marginTop: "1.5rem",
      alignItems: "center",
    },
    pageBtn: {
      padding: "0.5rem 1rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "6px",
      background: isDark ? "#334155" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
      cursor: "pointer",
    },
    pageBtnActive: {
      background: "#667eea",
      color: "#fff",
      borderColor: "#667eea",
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
      background: isDark ? "#1e293b" : "#fff",
      borderRadius: "12px",
      padding: "1.5rem",
      width: "90%",
      maxWidth: "450px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    modalTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      marginBottom: "1rem",
      fontSize: "0.875rem",
      background: isDark ? "#0f172a" : "#fff",
      color: isDark ? "#f1f5f9" : "#1f2937",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
      borderRadius: "8px",
      marginBottom: "1rem",
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
      border: "2px solid transparent",
      borderRadius: "8px",
      background: "#667eea",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "0.875rem",
    },
    error: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fecaca" : "#991b1b",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
    loading: {
      textAlign: "center",
      padding: "3rem",
      color: isDark ? "#94a3b8" : "#6b7280",
    },
    checkbox: { width: "18px", height: "18px", cursor: "pointer" },
    noData: {
      textAlign: "center",
      padding: "3rem",
      color: isDark ? "#64748b" : "#9ca3af",
    },
  };

  if (loading && users.length === 0) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management ({pagination.total})</h2>
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
            <option value="both">Both</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="createdAt">Join Date</option>
            <option value="trustScore">Trust Score</option>
            <option value="rating">Rating</option>
            <option value="name">Name</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.select}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {selectedUsers.length > 0 && (
        <div style={styles.bulkActions}>
          <span style={{ fontWeight: "500" }}>
            {selectedUsers.length} selected
          </span>
          <button
            style={{ ...styles.actionBtn, ...styles.warnBtn }}
            onClick={() => handleBulkAction("warn")}
            disabled={actionLoading}
          >
            Warn All
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.suspendBtn }}
            onClick={() => handleBulkAction("suspend")}
            disabled={actionLoading}
          >
            Suspend All
          </button>
          <button
            style={{ ...styles.actionBtn, ...styles.unsuspendBtn }}
            onClick={() => handleBulkAction("unsuspend")}
            disabled={actionLoading}
          >
            Unsuspend All
          </button>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>
              <input
                type="checkbox"
                checked={
                  selectedUsers.length === users.length && users.length > 0
                }
                onChange={toggleSelectAll}
                style={styles.checkbox}
              />
            </th>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Trust Score</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}>Joined</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={8} style={styles.noData}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                style={{
                  background: selectedUsers.includes(user._id)
                    ? "#f0f9ff"
                    : "transparent",
                }}
              >
                <td style={styles.td}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                    style={styles.checkbox}
                    disabled={user.userType === "admin"}
                  />
                </td>
                <td style={styles.td}>
                  <div style={styles.userInfo}>
                    <div style={styles.avatar}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          style={styles.avatarImg}
                        />
                      ) : (
                        user.firstName?.[0]?.toUpperCase() || "?"
                      )}
                    </div>
                    <div>
                      <div style={styles.userName}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={styles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: "#e0e7ff",
                      color: "#3730a3",
                    }}
                  >
                    {user.userType}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      ...(user.isSuspended
                        ? styles.statusSuspended
                        : styles.statusActive),
                    }}
                  >
                    {user.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.trustScore}>
                    <div style={styles.trustBar}>
                      <div
                        style={{
                          width: `${user.trustScore || 50}%`,
                          height: "100%",
                          background: getTrustScoreColor(user.trustScore || 50),
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: getTrustScoreColor(user.trustScore || 50),
                      }}
                    >
                      {user.trustScore || 50}
                    </span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{ color: "#f59e0b" }}>★</span>{" "}
                  {user.rating?.average?.toFixed(1) || "N/A"}
                  <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>
                    {" "}
                    ({user.rating?.count || 0})
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {user.userType !== "admin" && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        style={{ ...styles.actionBtn, ...styles.warnBtn }}
                        onClick={() => {
                          setSelectedUser(user);
                          setActionModal({ open: true, type: "warn" });
                        }}
                      >
                        Warn
                      </button>
                      {user.isSuspended ? (
                        <button
                          style={{
                            ...styles.actionBtn,
                            ...styles.unsuspendBtn,
                          }}
                          onClick={() => {
                            setSelectedUser(user);
                            setActionModal({ open: true, type: "unsuspend" });
                          }}
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          style={{ ...styles.actionBtn, ...styles.suspendBtn }}
                          onClick={() => {
                            setSelectedUser(user);
                            setActionModal({ open: true, type: "suspend" });
                          }}
                        >
                          Suspend
                        </button>
                      )}
                    </div>
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
            onClick={() => fetchUsers(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
            const pageNum = Math.max(1, pagination.page - 2) + i;
            if (pageNum > pagination.pages) return null;
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.pageBtn,
                  ...(pagination.page === pageNum ? styles.pageBtnActive : {}),
                }}
                onClick={() => fetchUsers(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            style={styles.pageBtn}
            onClick={() => fetchUsers(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Action Modal */}
      {actionModal.open && (
        <div
          style={styles.modal}
          onClick={() => setActionModal({ open: false, type: null })}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              {actionModal.type === "warn" && "⚠️ Send Warning"}
              {actionModal.type === "suspend" && "🚫 Suspend User"}
              {actionModal.type === "unsuspend" && "✅ Unsuspend User"}
            </h3>

            {selectedUser && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  background: "#f9fafb",
                  borderRadius: "8px",
                }}
              >
                <strong>
                  {selectedUser.firstName} {selectedUser.lastName}
                </strong>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {selectedUser.email}
                </div>
              </div>
            )}

            {actionModal.type !== "unsuspend" && (
              <>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Reason
                </label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Enter reason for this action..."
                  style={styles.textarea}
                />
              </>
            )}

            {actionModal.type === "suspend" && (
              <>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "500",
                  }}
                >
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={actionDays}
                  onChange={(e) =>
                    setActionDays(parseInt(e.target.value) || 30)
                  }
                  min={1}
                  max={365}
                  style={styles.input}
                />
              </>
            )}

            {actionModal.type === "unsuspend" && (
              <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                Are you sure you want to restore this user's access?
              </p>
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
                    actionModal.type === "suspend"
                      ? "#ef4444"
                      : actionModal.type === "warn"
                      ? "#f59e0b"
                      : "#22c55e",
                }}
                onClick={handleAction}
                disabled={
                  actionLoading ||
                  (actionModal.type !== "unsuspend" && !actionReason)
                }
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
