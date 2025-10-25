// src/components/ThemeToggle/index.jsx

import React from "react";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";

const ToggleButton = styled.button`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 3px;

  &:hover {
    background: ${(props) => (props.$isDark ? "#475569" : "#cbd5e0")};
  }

  &:focus {
    outline: 2px solid #f093fb;
    outline-offset: 2px;
  }
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => (props.$isDark ? "30px" : "0px")});
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ThemeToggle = ({ showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {showLabel && (
        <span
          style={{
            fontSize: "0.9rem",
            color: isDark ? "#cbd5e1" : "#718096",
            fontWeight: 500,
          }}
        >
          {isDark ? "Dark" : "Light"} Mode
        </span>
      )}
      <ToggleButton
        onClick={toggleTheme}
        $isDark={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <ToggleCircle $isDark={isDark}>{isDark ? "🌙" : "☀️"}</ToggleCircle>
      </ToggleButton>
    </div>
  );
};

export default ThemeToggle;
