// src/components/Header/index.jsx - ANIMATED WITH FRAMER MOTION
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useNotifications } from "../../context/NotificationContext";
import ThemeToggle from "../ThemeToggle";
import { motionVariants } from "../../animations/motionVariants";

import {
  HeaderContainer,
  HeaderContent,
  Logo,
  LogoText,
  Navigation,
  NavLink,
  UserSection,
  UserMenu,
  UserAvatar,
  UserName,
  DropdownMenu,
  DropdownItem,
  LoginButton,
  RegisterButton,
  MobileMenuButton,
  MobileMenu,
  MobileNavLink,
  NotificationBell,
  NotificationBadge,
} from "./styledComponents";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const isDonor = user?.userType === "donor" || user?.userType === "both";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    navigate("/dashboard");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer
      as={motion.header}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <HeaderContent>
        <Logo
          as={motion(Link)}
          to="/"
          onClick={closeMobileMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogoText>ShareTogether</LogoText>
        </Logo>

        <Navigation
          as={motion.nav}
          variants={motionVariants.staggerContainerFast}
          initial="hidden"
          animate="show"
        >
          {[
            { path: "/", label: "Home" },
            { path: "/listings", label: "Listings" },
            { path: "/impact/community", label: "Community" },
            ...(user
              ? [
                  { path: "/dashboard", label: "Dashboard" },
                  ...(isDonor
                    ? [{ path: "/create-listing", label: "Create Listing" }]
                    : []),
                ]
              : []),
          ].map((link) => (
            <NavLink
              key={link.path}
              as={motion(Link)}
              to={link.path}
              $active={isActive(link.path)}
              variants={motionVariants.scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.label}
            </NavLink>
          ))}
        </Navigation>

        <UserSection>
          <ThemeToggle showLabel={false} />

          {user ? (
            <>
              <NotificationBell
                as={motion.button}
                onClick={handleNotificationsClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                🔔
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <NotificationBadge
                      as={motion.span}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </NotificationBadge>
                  )}
                </AnimatePresence>
              </NotificationBell>

              <UserMenu ref={dropdownRef}>
                <motion.div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserAvatar as={motion.div} whileHover={{ scale: 1.05 }}>
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <span>
                        {user.firstName?.[0] || "?"}
                        {user.lastName?.[0] || ""}
                      </span>
                    )}
                  </UserAvatar>
                  <UserName>
                    {user.firstName} {user.lastName}
                  </UserName>
                  <motion.span
                    style={{ fontSize: "0.8rem", color: "#64748b" }}
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  >
                    ▼
                  </motion.span>
                </motion.div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <DropdownMenu
                      as={motion.div}
                      variants={motionVariants.dropDownSpring}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <motion.div
                        variants={motionVariants.staggerContainerFast}
                        initial="hidden"
                        animate="show"
                      >
                        {[
                          {
                            label: "📊 Dashboard",
                            onClick: handleDashboardClick,
                          },
                          { label: "👤 Profile", onClick: handleProfileClick },
                          {
                            label: "🌍 My Impact",
                            onClick: () => {
                              setIsDropdownOpen(false);
                              navigate("/impact/personal");
                            },
                          },
                          {
                            label: "📷 Scan QR",
                            onClick: () => {
                              setIsDropdownOpen(false);
                              navigate("/check-in");
                            },
                          },
                          {
                            label: (
                              <>
                                🔔 Notifications
                                {unreadCount > 0 && (
                                  <NotificationBadge
                                    style={{ marginLeft: "auto" }}
                                  >
                                    {unreadCount}
                                  </NotificationBadge>
                                )}
                              </>
                            ),
                            onClick: handleNotificationsClick,
                          },
                          ...(isDonor
                            ? [
                                {
                                  label: "➕ Create Listing",
                                  onClick: () => {
                                    setIsDropdownOpen(false);
                                    navigate("/create-listing");
                                  },
                                },
                              ]
                            : []),
                        ].map((item, index) => (
                          <DropdownItem
                            key={index}
                            as={motion.button}
                            variants={motionVariants.listItem}
                            whileHover={{ x: 5, backgroundColor: "#f7fafc" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={item.onClick}
                          >
                            {item.label}
                          </DropdownItem>
                        ))}

                        <motion.div
                          style={{
                            borderTop: "1px solid #e2e8f0",
                            margin: "0.5rem 0",
                          }}
                        />

                        <DropdownItem
                          as={motion.button}
                          variants={motionVariants.listItem}
                          whileHover={{ x: 5, backgroundColor: "#fed7d7" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          style={{ color: "#e53e3e" }}
                        >
                          🚪 Logout
                        </DropdownItem>
                      </motion.div>
                    </DropdownMenu>
                  )}
                </AnimatePresence>
              </UserMenu>
            </>
          ) : (
            <motion.div
              style={{ display: "flex", gap: "1rem" }}
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              <LoginButton
                as={motion(Link)}
                to="/login"
                variants={motionVariants.scaleIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </LoginButton>
              <RegisterButton
                as={motion(Link)}
                to="/register"
                variants={motionVariants.scaleIn}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </RegisterButton>
            </motion.div>
          )}
        </UserSection>

        <MobileMenuButton
          as={motion.button}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
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
        </MobileMenuButton>
      </HeaderContent>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            as={motion.div}
            variants={motionVariants.fadeSlideDown}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.div
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              {[
                { path: "/", label: "Home" },
                { path: "/listings", label: "Listings" },
                { path: "/impact/community", label: "Community Impact" },
                ...(user
                  ? [
                      { path: "/dashboard", label: "Dashboard" },
                      { path: "/impact/personal", label: "My Impact" },
                      { path: "/check-in", label: "📷 Scan QR Code" },
                      {
                        path: "/notifications",
                        label: `Notifications ${
                          unreadCount > 0 ? `(${unreadCount})` : ""
                        }`,
                      },
                      ...(isDonor
                        ? [{ path: "/create-listing", label: "Create Listing" }]
                        : []),
                      { path: "/profile", label: "Profile" },
                    ]
                  : [
                      { path: "/login", label: "Login" },
                      { path: "/register", label: "Sign Up" },
                    ]),
              ].map((link, index) => (
                <MobileNavLink
                  key={link.path}
                  as={motion(Link)}
                  to={link.path}
                  onClick={closeMobileMenu}
                  $active={isActive(link.path)}
                  variants={motionVariants.listItem}
                  custom={index}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </MobileNavLink>
              ))}

              {user && (
                <MobileNavLink
                  as={motion.button}
                  variants={motionVariants.listItem}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  style={{ color: "#e53e3e" }}
                >
                  Logout
                </MobileNavLink>
              )}
            </motion.div>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

export default Header;
