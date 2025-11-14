// src/components/Header/index.jsx - FIXED VERSION
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useNotifications } from "../../context/NotificationContext";
import ThemeToggle from "../ThemeToggle";

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

  // ✅ Get unread count from NotificationContext
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
    <HeaderContainer>
      <HeaderContent>
        <Logo as={Link} to="/" onClick={closeMobileMenu}>
          <LogoText>ShareTogether</LogoText>
        </Logo>
        <Navigation>
          <NavLink as={Link} to="/" $active={isActive("/")}>
            Home
          </NavLink>
          <NavLink as={Link} to="/listings" $active={isActive("/listings")}>
            Listings
          </NavLink>
          {/* ✅ Optional: Add Feed route if you create LiveDonationFeed */}
          {/* <NavLink as={Link} to="/feed" $active={isActive("/feed")}>
            Live Feed
          </NavLink> */}
          <NavLink
            as={Link}
            to="/impact/community"
            $active={isActive("/impact/community")}
          >
            Community
          </NavLink>

          {user && (
            <>
              <NavLink
                as={Link}
                to="/dashboard"
                $active={isActive("/dashboard")}
              >
                Dashboard
              </NavLink>
              {(isDonor || user?.userType === "both") && (
                <NavLink
                  as={Link}
                  to="/create-listing"
                  $active={isActive("/create-listing")}
                >
                  Create Listing
                </NavLink>
              )}
            </>
          )}
        </Navigation>

        <UserSection>
          <ThemeToggle showLabel={false} />
          {user ? (
            <>
              <NotificationBell onClick={handleNotificationsClick}>
                🔔
                {unreadCount > 0 && (
                  <NotificationBadge>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </NotificationBadge>
                )}
              </NotificationBell>

              <UserMenu ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setIsDropdownOpen(!isDropdownOpen);
                    }
                  }}
                >
                  <UserAvatar>
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
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isDropdownOpen && (
                  <DropdownMenu>
                    <DropdownItem onClick={handleDashboardClick}>
                      📊 Dashboard
                    </DropdownItem>
                    <DropdownItem onClick={handleProfileClick}>
                      👤 Profile
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/impact/personal");
                      }}
                    >
                      🌍 My Impact
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/verify-pickup");
                      }}
                    >
                      📷 Scan QR
                    </DropdownItem>
                    <DropdownItem onClick={handleNotificationsClick}>
                      🔔 Notifications
                      {unreadCount > 0 && (
                        <NotificationBadge style={{ marginLeft: "auto" }}>
                          {unreadCount}
                        </NotificationBadge>
                      )}
                    </DropdownItem>
                    {(isDonor || user?.userType === "both") && (
                      <DropdownItem
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/create-listing");
                        }}
                      >
                        ➕ Create Listing
                      </DropdownItem>
                    )}
                    <div
                      style={{
                        borderTop: "1px solid #e2e8f0",
                        margin: "0.5rem 0",
                      }}
                    />
                    <DropdownItem
                      onClick={handleLogout}
                      style={{ color: "#e53e3e" }}
                    >
                      🚪 Logout
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </UserMenu>
            </>
          ) : (
            <>
              <LoginButton as={Link} to="/login">
                Login
              </LoginButton>
              <RegisterButton as={Link} to="/register">
                Sign Up
              </RegisterButton>
            </>
          )}
        </UserSection>

        <MobileMenuButton
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </MobileMenuButton>
      </HeaderContent>

      {isMobileMenuOpen && (
        <MobileMenu>
          <MobileNavLink
            as={Link}
            to="/"
            onClick={closeMobileMenu}
            $active={isActive("/")}
          >
            Home
          </MobileNavLink>
          <MobileNavLink
            as={Link}
            to="/listings"
            onClick={closeMobileMenu}
            $active={isActive("/listings")}
          >
            Listings
          </MobileNavLink>
          <MobileNavLink
            as={Link}
            to="/impact/community"
            onClick={closeMobileMenu}
            $active={isActive("/impact/community")}
          >
            Community Impact
          </MobileNavLink>

          {user ? (
            <>
              <MobileNavLink
                as={Link}
                to="/dashboard"
                onClick={closeMobileMenu}
                $active={isActive("/dashboard")}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                as={Link}
                to="/impact/personal"
                onClick={closeMobileMenu}
                $active={isActive("/impact/personal")}
              >
                My Impact
              </MobileNavLink>
              <MobileNavLink
                as={Link}
                to="/verify-pickup"
                onClick={closeMobileMenu}
                $active={isActive("/verify-pickup")}
              >
                📷 Scan QR Code
              </MobileNavLink>
              <MobileNavLink
                as={Link}
                to="/notifications"
                onClick={closeMobileMenu}
                $active={isActive("/notifications")}
              >
                Notifications
                {unreadCount > 0 && (
                  <NotificationBadge style={{ marginLeft: "0.5rem" }}>
                    {unreadCount}
                  </NotificationBadge>
                )}
              </MobileNavLink>
              {(isDonor || user?.userType === "both") && (
                <MobileNavLink
                  as={Link}
                  to="/create-listing"
                  onClick={closeMobileMenu}
                  $active={isActive("/create-listing")}
                >
                  Create Listing
                </MobileNavLink>
              )}
              <MobileNavLink
                as={Link}
                to="/profile"
                onClick={closeMobileMenu}
                $active={isActive("/profile")}
              >
                Profile
              </MobileNavLink>
              <MobileNavLink
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                style={{ color: "#e53e3e" }}
              >
                Logout
              </MobileNavLink>
            </>
          ) : (
            <>
              <MobileNavLink
                as={Link}
                to="/login"
                onClick={closeMobileMenu}
                $active={isActive("/login")}
              >
                Login
              </MobileNavLink>
              <MobileNavLink
                as={Link}
                to="/register"
                onClick={closeMobileMenu}
                $active={isActive("/register")}
              >
                Sign Up
              </MobileNavLink>
            </>
          )}
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
