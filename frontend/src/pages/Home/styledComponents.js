// src/pages/Home/styledComponents.js - THEMED VERSION
import styled from "styled-components";

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--transition-base);
`;

export const HeroSection = styled.section`
  background: var(--gradient-primary);
  color: white;
  padding: 120px 20px 80px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xl);
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const CTAButton = styled.button`
  background: ${(props) =>
    props.$primary
      ? "var(--gradient-success)"
      : props.$secondary
      ? "transparent"
      : "var(--success)"};
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px 32px;
  border: ${(props) => (props.$secondary ? "2px solid white" : "none")};
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: ${(props) =>
    props.$secondary
      ? "0 4px 15px rgba(255, 255, 255, 0.2)"
      : "var(--shadow-lg)"};

  &:hover {
    background: ${(props) =>
      props.$secondary ? "rgba(255, 255, 255, 0.1)" : "var(--success-light)"};
    transform: translateY(-3px);
    box-shadow: var(--shadow-xl);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 14px 28px;
    width: 100%;
  }
`;

export const StatsSection = styled.section`
  background: var(--bg-secondary);
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    gap: 1.5rem;
  }
`;

export const StatCard = styled.div`
  background: var(--bg-card);
  padding: var(--spacing-2xl) var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  min-width: 200px;
  flex: 1;
  max-width: 280px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }

  @media (max-width: 768px) {
    min-width: 150px;
    padding: var(--spacing-xl) var(--spacing-lg);
  }
`;

export const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const PreviewSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-primary);

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const AboutSection = styled.section`
  padding: 5rem 2rem;
  background: var(--bg-secondary);
  color: var(--text-primary);

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const AboutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-md);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const AboutSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 4rem;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    gap: 2rem;
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  background: var(--bg-card);
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

export const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;
