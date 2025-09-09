import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
} from "./styledComponents";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo as={Link} to="/">
          <span role="img" aria-label="food">
            🍎
          </span>
          <LogoText>FoodShare</LogoText>
        </Logo>

        <Navigation>
          <NavLink as={Link} to="/" $active={isActive("/")}>
                Home
              </NavLink>

          <NavLink as={Link} to="/listings" $active={isActive("/listings")}>
            Listings
          </NavLink>

          <NavLink as={Link} to="/about" $active={isActive("/about")}>
            About
          </NavLink>

          <NavLink as={Link} to="/contact" $active={isActive("/contact")}>
            Contact
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
              <NavLink
                as={Link}
                to="/create-listing"
                $active={isActive("/create-listing")}
              >
                Create Listing
              </NavLink>
            </>
          )}
        </Navigation>

        <UserSection>
          {user ? (
            <UserMenu>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
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
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
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
                    <span>📊</span> Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={handleProfileClick}>
                    <span>👤</span> Profile
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/create-listing");
                    }}
                  >
                    <span>➕</span> Create Listing
                  </DropdownItem>
                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      margin: "0.5rem 0",
                    }}
                  />
                  <DropdownItem onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </DropdownItem>
                </DropdownMenu>
              )}
            </UserMenu>
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
            to="/about"
            onClick={closeMobileMenu}
            $active={isActive("/about")}
          >
            About
          </MobileNavLink>

          <MobileNavLink
            as={Link}
            to="/contact"
            onClick={closeMobileMenu}
            $active={isActive("/contact")}
          >
            Contact
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
                to="/create-listing"
                onClick={closeMobileMenu}
                $active={isActive("/create-listing")}
              >
                Create Listing
              </MobileNavLink>
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
