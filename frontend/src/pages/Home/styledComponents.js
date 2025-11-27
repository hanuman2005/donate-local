// src/pages/Home/styledComponents.js - OPTIMIZED FOR LANDING PAGE
import styled from "styled-components";

export const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-primary, #ffffff);
  color: var(--text-primary, #2d3748);
`;

export const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  margin-bottom: 1.5rem;
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
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const CTAButton = styled.button`
  background: ${props => props.$primary 
    ? 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)' 
    : props.$secondary 
    ? 'transparent' 
    : '#ff6b6b'};
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px 32px;
  border: ${props => props.$secondary ? '2px solid white' : 'none'};
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$secondary 
    ? '0 4px 15px rgba(255, 255, 255, 0.2)' 
    : '0 8px 25px rgba(255, 107, 107, 0.3)'};

  &:hover {
    background: ${props => props.$secondary 
      ? 'rgba(255, 255, 255, 0.1)' 
      : '#ff5252'};
    transform: translateY(-3px);
    box-shadow: ${props => props.$secondary 
      ? '0 8px 30px rgba(255, 255, 255, 0.3)' 
      : '0 12px 35px rgba(255, 107, 107, 0.4)'};
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  min-width: 200px;
  flex: 1;
  max-width: 280px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.2);
  }

  @media (max-width: 768px) {
    min-width: 150px;
    padding: 2rem 1.5rem;
  }
`;

export const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// ✅ NEW: Preview Section for Recent Listings
export const PreviewSection = styled.section`
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--bg-primary, #ffffff);

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

// About Section Components
export const AboutSection = styled.section`
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  color: var(--text-primary, #2d3748);

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const AboutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  color: #718096;
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
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

export const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #718096;
  line-height: 1.7;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;