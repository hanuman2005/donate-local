// src/components/ThemeToggle/index.jsx

import React from "react";
import styled from "styled-components";
import { useTheme } from "../../context/ThemeContext";

// Framer Motion props that should not be forwarded to the DOM
const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

const ToggleButton = styled.button.withConfig({ shouldForwardProp })`
  position: relative;
  width: 60px;
  height: 30px;
  background: ${(props) =>
    props.$isDark ? "var(--toggle-bg-dark)" : "var(--toggle-bg-light)"};
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 3px;

  &:hover {
    background: ${(props) =>
      props.$isDark
        ? "var(--toggle-bg-dark-hover)"
        : "var(--toggle-bg-light-hover)"};
  }

  &:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
`;

const ToggleCircle = styled.div`
  width: 24px;
  height: 24px;
  background: var(--toggle-circle-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => (props.$isDark ? "30px" : "0px")});
  box-shadow: var(--shadow-toggle-circle);
`;

const ThemeToggle = ({ showLabel = false }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {showLabel && (
        <span
          style={{
            fontSize: "0.9rem",
            color: isDark ? "var(--text-secondary)" : "var(--text-primary)",
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
