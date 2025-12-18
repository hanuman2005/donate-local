// src/components/Footer/styledComponents.js
import styled from "styled-components";

export const FooterContainer = styled.footer`
  background: #1e293b;
  color: #f1f1f1;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
`;

export const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
`;

export const FooterColumn = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
`;

export const FooterTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #fff;
`;

export const FooterLink = styled.a`
  display: block;
  margin-bottom: 0.5rem;
  text-decoration: none;
  color: #ccc;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const SocialIcon = styled.a`
  font-size: 1.5rem;
  color: #ccc;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
`;

export const FooterBottom = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.85rem;
  border-top: 1px solid #333;
  padding-top: 1rem;
  color: #aaa;
`;
