// src/globalStyles.js
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8fafc;
    color: #1a202c;
    line-height: 1.6;
  }

  /* Modal scroll lock */
  body.modal-open {
    overflow: hidden;
    padding-right: 15px;
  }

  html {
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .leaflet-container {
    height: 400px;
    width: 100%;
    border-radius: 12px;
  }

  /* Loading spinner animation */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Fade in animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

export const Button = styled.button`
  background: ${(props) => {
    if (props.variant === "primary")
      return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    if (props.variant === "secondary") return "#ffffff";
    if (props.variant === "danger")
      return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
    return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
  }};
  color: ${(props) => (props.variant === "secondary" ? "#374151" : "#ffffff")};
  border: ${(props) =>
    props.variant === "secondary" ? "2px solid #e5e7eb" : "none"};
  padding: ${(props) =>
    props.size === "large" ? "1rem 2rem" : "0.75rem 1.5rem"};
  border-radius: 12px;
  font-size: ${(props) => (props.size === "large" ? "1.1rem" : "1rem")};
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: ${(props) =>
      props.size === "large" ? "0.875rem 1.5rem" : "0.625rem 1.25rem"};
    font-size: ${(props) => (props.size === "large" ? "1rem" : "0.875rem")};
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: ${(props) => props.padding || "1.5rem"};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: ${(props) => props.padding || "1rem"};
    border-radius: 12px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  resize: vertical;
  min-height: 120px;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
    min-height: 100px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
  cursor: pointer;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.minWidth || "300px"}, 1fr)
  );
  gap: ${(props) => props.gap || "1.5rem"};
  margin: ${(props) => props.margin || "0"};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${(props) => props.gap || "1rem"};
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.align || "center"};
  justify-content: ${(props) => props.justify || "flex-start"};
  gap: ${(props) => props.gap || "1rem"};
  flex-wrap: ${(props) => props.wrap || "nowrap"};
  flex-direction: ${(props) => props.direction || "row"};

  @media (max-width: 768px) {
    flex-direction: ${(props) =>
      props.mobileDirection || props.direction || "column"};
    gap: ${(props) => props.mobileGap || props.gap || "0.75rem"};
  }
`;

export default GlobalStyles;