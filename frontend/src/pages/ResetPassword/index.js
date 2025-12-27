// frontend/src/pages/ResetPassword/index.js
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const ResetPassword = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isDark
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1rem",
    },
    card: {
      background: isDark ? "#1e293b" : "#ffffff",
      borderRadius: "16px",
      padding: "2.5rem",
      width: "100%",
      maxWidth: "420px",
      boxShadow: isDark
        ? "0 25px 50px rgba(0, 0, 0, 0.5)"
        : "0 25px 50px rgba(0, 0, 0, 0.15)",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    icon: {
      width: "64px",
      height: "64px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      fontSize: "2rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: isDark ? "#f1f5f9" : "#1f2937",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: isDark ? "#94a3b8" : "#6b7280",
      fontSize: "0.95rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: isDark ? "#e2e8f0" : "#374151",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "0.875rem 1rem",
      paddingRight: "3rem",
      border: `2px solid ${isDark ? "#334155" : "#e5e7eb"}`,
      borderRadius: "10px",
      fontSize: "1rem",
      background: isDark ? "#0f172a" : "#f9fafb",
      color: isDark ? "#f1f5f9" : "#1f2937",
      outline: "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxSizing: "border-box",
    },
    togglePassword: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.25rem",
      opacity: 0.6,
    },
    button: {
      padding: "0.875rem 1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    error: {
      background: isDark ? "#7f1d1d" : "#fee2e2",
      color: isDark ? "#fca5a5" : "#991b1b",
      padding: "0.875rem",
      borderRadius: "10px",
      fontSize: "0.875rem",
      textAlign: "center",
    },
    success: {
      background: isDark ? "#166534" : "#dcfce7",
      color: isDark ? "#86efac" : "#166534",
      padding: "1.25rem",
      borderRadius: "10px",
      textAlign: "center",
    },
    successIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
    },
    successTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
    },
    successText: {
      fontSize: "0.95rem",
      opacity: 0.9,
    },
    requirements: {
      fontSize: "0.8rem",
      color: isDark ? "#64748b" : "#9ca3af",
      marginTop: "0.25rem",
    },
    link: {
      color: "#667eea",
      textDecoration: "none",
      fontWeight: "500",
    },
    footer: {
      textAlign: "center",
      marginTop: "1.5rem",
      color: isDark ? "#94a3b8" : "#6b7280",
      fontSize: "0.875rem",
    },
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.success}>
            <div style={styles.successIcon}>✅</div>
            <div style={styles.successTitle}>Password Reset Successful!</div>
            <div style={styles.successText}>
              Your password has been updated. Redirecting to login...
            </div>
          </div>
          <div style={styles.footer}>
            <Link to="/login" style={styles.link}>
              Go to Login Now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🔑</div>
          <h1 style={styles.title}>Reset Password</h1>
          <p style={styles.subtitle}>Enter your new password below</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                autoFocus
              />
              <button
                type="button"
                style={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <span style={styles.requirements}>Minimum 6 characters</span>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
