// src/components/Sidebar/index.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import ThemeToggle from "../Common/ThemeToggle";
// import { motionVariants } from "../../animations/motionVariants";

// ...existing code...

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

// Create motion-enabled Link component (replaces deprecated motion(Link))
const MotionLink = motion.create(Link);

const Sidebar = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const isDonor = user?.userType === "donor" || user?.userType === "both";
  const isRecipient =
    user?.userType === "recipient" || user?.userType === "both";

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

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
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

  const isAdmin = user?.userType === "admin";

  const userNavItems = user
    ? [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/schedules", label: "My Schedules", icon: "📅" },
        ...(isRecipient
          ? [
              { path: "/my-pickups", label: "My Pickups", icon: "🚚" },
              {
                path: "/route-optimizer",
                label: "Route Optimizer",
                icon: "🚗",
              },
            ]
          : []),
        { path: "/waste-analyzer", label: "AI Analysis", icon: "🤖" },
        { path: "/analysis-history", label: "Analysis History", icon: "📜" },
        ...(isDonor
          ? [{ path: "/create-listing", label: "Create Listing", icon: "➕" }]
          : []),
        ...(isAdmin
          ? [{ path: "/admin-dashboard", label: "Admin Dashboard", icon: "🛡️" }]
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

  // Render navigation items with accessibility
  const renderNavItems = (items) =>
    items.map((item) => (
      <NavItem
        key={item.path}
        as={MotionLink}
        to={item.path}
        $active={isActive(item.path)}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        aria-label={item.label}
        aria-current={isActive(item.path) ? "page" : undefined}
      >
        <NavIcon aria-hidden="true">{item.icon}</NavIcon>
        <NavLabel>{item.label}</NavLabel>
        {item.badge && (
          <NavBadge aria-label={`${item.badge} new notifications`}>
            {item.badge > 9 ? "9+" : item.badge}
          </NavBadge>
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
      aria-label="Main navigation"
    >
      {/* Logo */}
      <SidebarLogo as={Link} to="/" aria-label="LifeLoop - Go to homepage">
        <LogoIcon aria-hidden="true">♻️</LogoIcon>
        <LogoText>LifeLoop</LogoText>
      </SidebarLogo>
      {/* Navigation */}
      <SidebarNav role="navigation" aria-label="Primary navigation">
        {/* Public Navigation */}
        <NavSection role="group" aria-labelledby="menu-section">
          <NavSectionTitle id="menu-section">Menu</NavSectionTitle>
          {renderNavItems(publicNavItems)}
        </NavSection>

        {/* User Navigation */}
        {user && (
          <NavSection
            $marginTop="1rem"
            role="group"
            aria-labelledby="activity-section"
          >
            <NavSectionTitle id="activity-section">My Activity</NavSectionTitle>
            {renderNavItems(userNavItems)}
          </NavSection>
        )}

        {/* User Actions */}
        {user && (
          <NavSection
            $marginTop="1rem"
            role="group"
            aria-labelledby="actions-section"
          >
            <NavSectionTitle id="actions-section">Actions</NavSectionTitle>
            {renderNavItems(userActionsItems)}
          </NavSection>
        )}

        {/* Auth Links for non-logged users */}
        {!user && (
          <NavSection $marginTop="1rem">
            <NavItem
              as={MotionLink}
              to="/login"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>🔑</NavIcon>
              <NavLabel>Login</NavLabel>
            </NavItem>
            <NavItem
              as={MotionLink}
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
                role="menu"
                aria-label="User menu"
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
                  role="menuitem"
                  aria-label="View your profile"
                >
                  <span aria-hidden="true">👤</span>
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
                  role="menuitem"
                  aria-label="Go to dashboard"
                >
                  <span aria-hidden="true">📊</span>
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
                  role="menuitem"
                  aria-label="View your impact statistics"
                >
                  <span aria-hidden="true">🌟</span>
                  My Impact
                </DropdownItem>

                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid var(--border-color)",
                    margin: "0.5rem 0",
                  }}
                  role="separator"
                />

                {/* Logout Option */}
                <DropdownItem
                  as={motion.button}
                  onClick={handleLogout}
                  className="danger"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  role="menuitem"
                  aria-label="Log out of your account"
                >
                  <span aria-hidden="true">🚪</span>
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
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsUserMenuOpen(!isUserMenuOpen);
              }
            }}
            style={{ cursor: "pointer" }} // Ensure it looks clickable
            role="button"
            tabIndex={0}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            aria-label={`User menu for ${user.firstName} ${user.lastName}`}
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
      <MobileHeader role="banner">
        <MobileHeaderContent>
          <MobileLogo as={Link} to="/" aria-label="LifeLoop - Go to homepage">
            <span aria-hidden="true">♻️</span>
            <LogoText>DonateLocal</LogoText>
          </MobileLogo>

          <MobileActions>
            <ThemeToggle showLabel={false} />

            {user && (
              <NotificationButton
                as={motion.button}
                onClick={() => navigate("/notifications")}
                whileTap={{ scale: 0.9 }}
                aria-label={`Notifications${
                  unreadCount > 0 ? `, ${unreadCount} unread` : ""
                }`}
              >
                <span aria-hidden="true">🔔</span>
                {unreadCount > 0 && (
                  <NotificationBadge aria-hidden="true">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </NotificationBadge>
                )}
              </NotificationButton>
            )}

            <MenuButton
              as={motion.button}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0,
                }}
                aria-hidden="true"
              />
              <motion.span
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
                aria-hidden="true"
              />
              <motion.span
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0,
                }}
                aria-hidden="true"
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
              aria-hidden="true"
            />

            <MobileMenu
              as={motion.nav}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              id="mobile-menu"
              aria-label="Mobile navigation"
              role="navigation"
            >
              <SidebarNav>
                <NavSection role="group" aria-labelledby="mobile-menu-section">
                  <NavSectionTitle id="mobile-menu-section">
                    Menu
                  </NavSectionTitle>
                  {renderNavItems(publicNavItems)}
                </NavSection>

                {user && (
                  <NavSection
                    $marginTop="1rem"
                    role="group"
                    aria-labelledby="mobile-activity-section"
                  >
                    <NavSectionTitle id="mobile-activity-section">
                      My Activity
                    </NavSectionTitle>
                    {renderNavItems(userNavItems)}
                  </NavSection>
                )}

                {user && (
                  <NavSection
                    $marginTop="1rem"
                    role="group"
                    aria-labelledby="mobile-actions-section"
                  >
                    <NavSectionTitle id="mobile-actions-section">
                      Actions
                    </NavSectionTitle>
                    {renderNavItems(userActionsItems)}
                  </NavSection>
                )}

                {!user && (
                  <NavSection $marginTop="1rem">
                    <NavItem
                      as={Link}
                      to="/login"
                      aria-label="Login to your account"
                    >
                      <NavIcon aria-hidden="true">🔑</NavIcon>
                      <NavLabel>Login</NavLabel>
                    </NavItem>
                    <NavItem
                      as={Link}
                      to="/register"
                      aria-label="Create new account"
                    >
                      <NavIcon aria-hidden="true">✨</NavIcon>
                      <NavLabel>Sign Up</NavLabel>
                    </NavItem>
                  </NavSection>
                )}

                {user && (
                  <NavSection
                    $marginTop="1rem"
                    role="group"
                    aria-labelledby="mobile-account-section"
                  >
                    <NavSectionTitle id="mobile-account-section">
                      Account
                    </NavSectionTitle>
                    <NavItem
                      as={Link}
                      to="/profile"
                      aria-label="View your profile"
                    >
                      <NavIcon aria-hidden="true">👤</NavIcon>
                      <NavLabel>Profile</NavLabel>
                    </NavItem>
                    <NavItem
                      as="button"
                      onClick={handleLogout}
                      style={{ color: "var(--danger)" }}
                      aria-label="Log out of your account"
                    >
                      <NavIcon aria-hidden="true">🚪</NavIcon>
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
