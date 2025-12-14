// src/components/Header/styledComponents.js - FIXED MOBILE MENU
import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 80px;
  backdrop-filter: blur(10px);
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%; /* ✅ Ensure full height */

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Navigation = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.span`
  color: var(--text-primary);
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap; /* ✅ Prevent text wrapping */

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #667eea;
      border-radius: 50%;
    }
  `}
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  flex-shrink: 0; /* ✅ Prevent shrinking */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const UserName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 200px;
  margin-top: 0.5rem;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  text-align: left;
  color: #4a5568;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap; /* ✅ Prevent text wrapping */

  &:hover {
    background: #f7fafc;
    color: #2d3748;
  }

  span {
    font-size: 1rem;
  }
`;

export const LoginButton = styled.span`
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap; /* ✅ Prevent text wrapping */

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

export const RegisterButton = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  white-space: nowrap; /* ✅ Prevent text wrapping */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  gap: 4px;
  z-index: 1001; /* ✅ Ensure it's above content */

  span {
    width: 25px;
    height: 2px;
    background: #4a5568;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

// ✅ FIXED: Mobile menu with proper vertical alignment
export const MobileMenu = styled.div`
  position: fixed; /* ✅ Changed from relative */
  top: 80px; /* ✅ Position below header */
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  max-height: calc(100vh - 80px); /* ✅ Prevent overflow */
  overflow-y: auto; /* ✅ Enable scrolling if needed */
  z-index: 999;

  /* ✅ CRITICAL: Ensure vertical stacking */
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: flex !important; /* ✅ Override any other styles */
  }
`;

// ✅ FIXED: Mobile nav link with proper display
export const MobileNavLink = styled.span`
  display: block; /* ✅ Ensure block-level element */
  width: 100%; /* ✅ Full width */
  color: ${(props) => (props.$active ? "#667eea" : "#64748b")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left; /* ✅ Align text to left */
  background: ${(props) =>
    props.$active ? "rgba(102, 126, 234, 0.1)" : "transparent"};

  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
  }
`;

export const NotificationBell = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 0.65rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;
