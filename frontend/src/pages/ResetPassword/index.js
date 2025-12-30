// frontend/src/pages/ResetPassword/index.js - Updated with CSS Variables
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
      background: "var(--gradient-primary)",
      padding: "1rem",
    },
    card: {
      background: "var(--bg-card)",
      borderRadius: "var(--radius-xl)",
      padding: "2.5rem",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "var(--shadow-xl)",
      border: "1px solid var(--border-color)",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    icon: {
      width: "64px",
      height: "64px",
      background: "var(--gradient-primary)",
      borderRadius: "var(--radius-xl)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      fontSize: "2rem",
      boxShadow: "var(--shadow-lg)",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "var(--text-primary)",
      marginBottom: "0.5rem",
    },
    subtitle: {
      color: "var(--text-secondary)",
      fontSize: "0.95rem",
      lineHeight: "1.5",
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
      fontWeight: "600",
      color: "var(--text-secondary)",
    },
    inputWrapper: {
      position: "relative",
    },
    input: {
      width: "100%",
      padding: "0.875rem 1rem",
      paddingRight: "3rem",
      border: "2px solid var(--border-color)",
      borderRadius: "var(--radius-lg)",
      fontSize: "1rem",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      outline: "none",
      transition: "all var(--transition-base)",
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
      background: "var(--gradient-primary)",
      color: "var(--text-inverse)",
      border: "none",
      borderRadius: "var(--radius-lg)",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      transition: "all var(--transition-base)",
      boxShadow: "var(--shadow-md)",
    },
    error: {
      background: "var(--error-bg)",
      color: "var(--error)",
      padding: "0.875rem",
      borderRadius: "var(--radius-md)",
      fontSize: "0.875rem",
      textAlign: "center",
      border: "1px solid var(--error)",
    },
    success: {
      background: "var(--success-bg)",
      color: "var(--success)",
      padding: "1.25rem",
      borderRadius: "var(--radius-lg)",
      textAlign: "center",
      border: "1px solid var(--success)",
    },
    successIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
    },
    successTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "var(--success)",
    },
    successText: {
      fontSize: "0.95rem",
      opacity: 0.9,
      lineHeight: "1.5",
    },
    requirements: {
      fontSize: "0.8rem",
      color: "var(--text-muted)",
      marginTop: "0.25rem",
    },
    link: {
      color: "var(--primary)",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color var(--transition-fast)",
    },
    footer: {
      textAlign: "center",
      marginTop: "1.5rem",
      color: "var(--text-secondary)",
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