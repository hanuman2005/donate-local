// src/components/Common/SkipLink.js - Accessibility Skip Navigation Link
import styled from "styled-components";

const SkipLinkStyled = styled.a`
  position: fixed;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  background: var(--primary);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  box-shadow: var(--shadow-lg);
  transition: top 0.3s ease;

  &:focus {
    top: var(--spacing-md);
    outline: 3px solid var(--primary-dark);
    outline-offset: 2px;
  }

  &:focus-visible {
    top: var(--spacing-md);
  }
`;

const SkipLink = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <SkipLinkStyled href="#main-content" onClick={handleClick}>
      Skip to main content
    </SkipLinkStyled>
  );
};

export default SkipLink;
