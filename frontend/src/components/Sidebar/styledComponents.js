// src/components/Sidebar/styledComponents.js - THEMED VERSION
import styled from "styled-components";

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

export const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: all var(--transition-base);

  @media (max-width: 1023px) {
    display: none;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: var(--radius-sm);
  }
`;

export const SidebarLogo = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--transition-base);

  &:hover {
    background: var(--bg-hover);
  }
`;

export const LogoIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

export const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: var(--spacing-lg) 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

export const NavSection = styled.div`
  padding: 0 var(--spacing-md);
  margin-top: ${(props) => props.$marginTop || "0"};
`;

export const NavSectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--spacing-lg) var(--spacing-sm) var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
`;

export const NavItem = styled.div.withConfig({ shouldForwardProp })`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin: 4px 0;
  border-radius: var(--radius-md);
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-primary)"};
  background: ${(props) => (props.$active ? "var(--bg-hover)" : "transparent")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  position: relative;
  user-select: none;
  min-height: 44px;

  &:hover {
    background: var(--bg-hover);
    color: var(--primary);
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }

  ${(props) =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--gradient-primary);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
    }
  `}
`;

export const NavIcon = styled.span`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
`;

export const NavLabel = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavBadge = styled.span`
  background: var(--error);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SidebarUser = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  position: relative;
  isolation: isolate;
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserMenuIcon = styled.span`
  font-size: 1rem;
  color: var(--text-secondary);
  transition: transform var(--transition-base);
`;

export const UserDropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: var(--spacing-md);
  right: var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-sm);
  z-index: 999999;
`;

export const DropdownItem = styled.button.withConfig({ shouldForwardProp })`
  width: 100%;
  background: none;
  border: none;
  padding: var(--spacing-md) var(--spacing-md);
  text-align: left;
  color: var(--text-primary);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  white-space: nowrap;
  font-size: 0.9rem;

  &:hover {
    background: var(--bg-hover);
    color: var(--primary);
    transform: translateX(4px);
  }

  &:active {
    transform: scale(0.98);
  }

  &.danger {
    color: var(--error);

    &:hover {
      background: var(--error-bg);
      color: var(--error);
    }
  }

  span {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

// Mobile styles continue...
export const MobileHeader = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  height: 64px;
  backdrop-filter: blur(10px);

  @media (max-width: 1023px) {
    display: block;
  }
`;

export const MobileHeaderContent = styled.div`
  height: 100%;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MobileLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  cursor: pointer;

  span:first-child {
    font-size: 1.5rem;
  }
`;

export const MobileActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

export const NotificationButton = styled.button.withConfig({
  shouldForwardProp,
})`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: var(--spacing-sm);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--bg-hover);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--error);
  color: white;
  border-radius: var(--radius-full);
  padding: 2px 5px;
  font-size: 0.6rem;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-secondary);
`;

export const MenuButton = styled.button.withConfig({ shouldForwardProp })`
  display: flex;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);
  gap: 4px;

  span {
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all var(--transition-base);
  }
`;

export const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  box-shadow: var(--shadow-xl);
  z-index: 999;
  overflow-y: auto;
  flex-direction: column;

  @media (max-width: 1023px) {
    display: flex;
  }
`;

export const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--overlay-bg);
  z-index: 998;
  backdrop-filter: blur(2px);

  @media (max-width: 1023px) {
    display: block;
  }
`;

export const MainContent = styled.main`
  min-height: 100vh;
  background: var(--bg-primary);
  transition: all var(--transition-base);
  padding: var(--spacing-xl);

  @media (min-width: 1024px) {
    margin-left: 280px;
  }

  @media (max-width: 1023px) {
    padding-top: calc(64px + var(--spacing-xl));
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
`;
