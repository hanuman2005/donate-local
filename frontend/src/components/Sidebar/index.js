// src/components/Sidebar/index.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import ThemeToggle from "../ThemeToggle";
import { motionVariants } from "../../animations/motionVariants";

import {
  SidebarContainer,
  SidebarLogo,
  LogoIcon,
  LogoText,
  SidebarNav,
  NavSection,
  NavSectionTitle,
  NavItem,
  NavIcon,
  NavLabel,
  NavBadge,
  SidebarUser,
  UserCard,
  UserAvatar,
  UserInfo,
  UserName,
  UserEmail,
  UserMenuIcon,
  UserDropdown,
  DropdownItem,
  MobileHeader,
  MobileHeaderContent,
  MobileLogo,
  MobileActions,
  NotificationButton,
  NotificationBadge,
  MenuButton,
  MobileMenu,
  MobileOverlay,
  MainContent,
} from "./styledComponents";

const Sidebar = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const isDonor = user?.userType === "donor" || user?.userType === "both";

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  // Navigation items
  const publicNavItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/listings", label: "Browse Items", icon: "📦" },
    { path: "/impact/community", label: "Community Impact", icon: "🌍" },
  ];

  const userNavItems = user
    ? [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/waste-analyzer", label: "AI Analysis", icon: "🤖" },
        { path: "/analysis-history", label: "Analysis History", icon: "📜" },
        { path: "/schedules", label: "My Schedules", icon: "📅" },
        ...(isDonor
          ? [
              { path: "/my-pickups", label: "Pending Pickups", icon: "📦" },
              { path: "/create-listing", label: "Create Listing", icon: "➕" },
            ]
          : []),
      ]
    : [];

  const userActionsItems = user
    ? [
        {
          path: "/notifications",
          label: "Notifications",
          icon: "🔔",
          badge: unreadCount > 0 ? unreadCount : null,
        },
        // ✅ QR Scanner - ONLY for recipients
        ...(user.userType === "recipient" || user.userType === "both"
          ? [{ path: "/check-in", label: "Scan QR Code", icon: "📷" }]
          : []),
        { path: "/impact/personal", label: "My Impact", icon: "🌟" },
      ]
    : [];

  // Render navigation items
  const renderNavItems = (items) =>
    items.map((item) => (
      <NavItem
        key={item.path}
        as={motion(Link)}
        to={item.path}
        $active={isActive(item.path)}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <NavIcon>{item.icon}</NavIcon>
        <NavLabel>{item.label}</NavLabel>
        {item.badge && (
          <NavBadge>{item.badge > 9 ? "9+" : item.badge}</NavBadge>
        )}
      </NavItem>
    ));

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <SidebarContainer
      as={motion.aside}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Logo */}
      <SidebarLogo as={Link} to="/">
        <LogoIcon>♻️</LogoIcon>
        <LogoText>DonateLocal</LogoText>
      </SidebarLogo>
      {/* Navigation */}
      <SidebarNav>
        {/* Public Navigation */}
        <NavSection>
          <NavSectionTitle>Menu</NavSectionTitle>
          {renderNavItems(publicNavItems)}
        </NavSection>

        {/* User Navigation */}
        {user && (
          <NavSection $marginTop="1rem">
            <NavSectionTitle>My Activity</NavSectionTitle>
            {renderNavItems(userNavItems)}
          </NavSection>
        )}

        {/* User Actions */}
        {user && (
          <NavSection $marginTop="1rem">
            <NavSectionTitle>Actions</NavSectionTitle>
            {renderNavItems(userActionsItems)}
          </NavSection>
        )}

        {/* Auth Links for non-logged users */}
        {!user && (
          <NavSection $marginTop="1rem">
            <NavItem
              as={Link}
              to="/login"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>🔑</NavIcon>
              <NavLabel>Login</NavLabel>
            </NavItem>
            <NavItem
              as={Link}
              to="/register"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>✨</NavIcon>
              <NavLabel>Sign Up</NavLabel>
            </NavItem>
          </NavSection>
        )}
      </SidebarNav>
      {/* User Section at Bottom */}
      {user && (
        <SidebarUser ref={userMenuRef}>
          {/* User Dropdown Menu */}
          <AnimatePresence>
            {isUserMenuOpen && (
              <UserDropdown
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Profile Option */}
                <DropdownItem
                  as={motion.button}
                  onClick={() => {
                    navigate("/profile");
                    setIsUserMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>👤</span>
                  View Profile
                </DropdownItem>

                {/* Dashboard Option */}
                <DropdownItem
                  as={motion.button}
                  onClick={() => {
                    navigate("/dashboard");
                    setIsUserMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>📊</span>
                  Dashboard
                </DropdownItem>

                {/* My Impact Option */}
                <DropdownItem
                  as={motion.button}
                  onClick={() => {
                    navigate("/impact/personal");
                    setIsUserMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🌟</span>
                  My Impact
                </DropdownItem>

                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid var(--border-color)",
                    margin: "0.5rem 0",
                  }}
                />

                {/* Logout Option */}
                <DropdownItem
                  as={motion.button}
                  onClick={handleLogout}
                  className="danger"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🚪</span>
                  Logout
                </DropdownItem>
              </UserDropdown>
            )}
          </AnimatePresence>

          {/* User Card (Clickable) */}
          <UserCard
            onClick={() => {
              console.log("Toggling menu:", !isUserMenuOpen); // Debug log
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            style={{ cursor: "pointer" }} // Ensure it looks clickable
          >
            <UserAvatar>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <span style={{ display: user.avatar ? "none" : "flex" }}>
                {user.firstName?.[0]?.toUpperCase()}
                {user.lastName?.[0]?.toUpperCase()}
              </span>
            </UserAvatar>

            <UserInfo>
              <UserName>
                {user.firstName} {user.lastName}
              </UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>

            <UserMenuIcon>▼</UserMenuIcon>
          </UserCard>

          {/* Theme Toggle */}
          <div style={{ marginTop: "0.75rem" }}>
            <ThemeToggle showLabel={true} />
          </div>
        </SidebarUser>
      )}
    </SidebarContainer>
  );

  // Mobile Header & Menu
  const MobileNav = () => (
    <>
      <MobileHeader>
        <MobileHeaderContent>
          <MobileLogo as={Link} to="/">
            <span>♻️</span>
            <LogoText>DonateLocal</LogoText>
          </MobileLogo>

          <MobileActions>
            <ThemeToggle showLabel={false} />

            {user && (
              <NotificationButton
                as={motion.button}
                onClick={() => navigate("/notifications")}
                whileTap={{ scale: 0.9 }}
              >
                🔔
                {unreadCount > 0 && (
                  <NotificationBadge>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </NotificationBadge>
                )}
              </NotificationButton>
            )}

            <MenuButton
              as={motion.button}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
              />
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
              />
            </MenuButton>
          </MobileActions>
        </MobileHeaderContent>
      </MobileHeader>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <MobileOverlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <MobileMenu
              as={motion.div}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SidebarNav>
                <NavSection>
                  <NavSectionTitle>Menu</NavSectionTitle>
                  {renderNavItems(publicNavItems)}
                </NavSection>

                {user && (
                  <NavSection $marginTop="1rem">
                    <NavSectionTitle>My Activity</NavSectionTitle>
                    {renderNavItems(userNavItems)}
                  </NavSection>
                )}

                {user && (
                  <NavSection $marginTop="1rem">
                    <NavSectionTitle>Actions</NavSectionTitle>
                    {renderNavItems(userActionsItems)}
                  </NavSection>
                )}

                {!user && (
                  <NavSection $marginTop="1rem">
                    <NavItem as={Link} to="/login">
                      <NavIcon>🔑</NavIcon>
                      <NavLabel>Login</NavLabel>
                    </NavItem>
                    <NavItem as={Link} to="/register">
                      <NavIcon>✨</NavIcon>
                      <NavLabel>Sign Up</NavLabel>
                    </NavItem>
                  </NavSection>
                )}

                {user && (
                  <NavSection $marginTop="1rem">
                    <NavSectionTitle>Account</NavSectionTitle>
                    <NavItem as={Link} to="/profile">
                      <NavIcon>👤</NavIcon>
                      <NavLabel>Profile</NavLabel>
                    </NavItem>
                    <NavItem
                      as="button"
                      onClick={handleLogout}
                      style={{ color: "#ef4444" }}
                    >
                      <NavIcon>🚪</NavIcon>
                      <NavLabel>Logout</NavLabel>
                    </NavItem>
                  </NavSection>
                )}
              </SidebarNav>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileNav />
      <MainContent>{children}</MainContent>
    </>
  );
};

export default Sidebar;
