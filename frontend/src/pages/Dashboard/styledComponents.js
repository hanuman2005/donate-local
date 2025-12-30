// src/pages/Dashboard/styledComponents.js - Updated with new color scheme
import styled from "styled-components";
import { motion } from "framer-motion";

// ============================================
// MAIN WRAPPER
// ============================================
export const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: background var(--transition-base);

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

// ============================================
// HERO SECTION
// ============================================
export const HeroCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: 3rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;

  /* Decorative gradient orb */
  &::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(35, 76, 106, 0.1), transparent);
    border-radius: 50%;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: var(--radius-xl);
  }
`;

export const HeroContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
`;

export const HeroText = styled.div`
  flex: 1;

  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  p {
    font-size: clamp(1rem, 2vw, 1.1rem);
    color: var(--text-secondary);
    margin: 0;
    max-width: 600px;
    line-height: 1.5;

    strong {
      font-weight: 700;
      color: var(--primary);
    }
  }
`;

export const PrimaryButton = styled(motion.button)`
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-xl);
  padding: 1rem 2.5rem;
  color: var(--text-inverse);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(27, 60, 83, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all var(--transition-base);
  white-space: nowrap;

  span {
    font-size: 1.5rem;
  }

  &:hover {
    box-shadow: 0 15px 40px rgba(27, 60, 83, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
`;

// ============================================
// STATS GRID
// ============================================
export const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);

  /* Top accent line */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) => props.$color || 'var(--primary)'};
  }

  /* Hover glow effect */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(35, 76, 106, 0.1), transparent);
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

export const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const StatValue = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.5rem 0;
  line-height: 1;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-top: 0.5rem;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const ProgressRing = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin: 1rem 0;

  svg {
    transform: rotate(-90deg);
  }

  .progress-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;

    .progress-value {
      font-size: 1.1rem;
    }
  }
`;

// ============================================
// CONTENT GRID
// ============================================
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const MainContent = styled.div`
  /* Grid column handled by parent */
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  transition: box-shadow var(--transition-base), background var(--transition-base);

  /* Optional: add a hover effect for interactivity */
  &:hover {
    box-shadow: var(--shadow-lg);
    background: rgba(255, 255, 255, 0.22);
  }

  @media (max-width: 1024px) {
    padding: 1.25rem 1rem;
    border-radius: var(--radius-xl);
  }
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    border-radius: var(--radius-lg);
  }
`;

// ============================================
// GLASS CARD
// ============================================
export const GlassCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$fullWidth &&
    `
    grid-column: span 2;
    
    @media (max-width: 1024px) {
      grid-column: span 1;
    }
  `}

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: var(--radius-xl);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;

    h2 {
      font-size: 1.3rem;
    }
  }
`;

export const ViewAllButton = styled(motion.button)`
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.5rem 1rem;
  color: var(--primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
  }

  @media (max-width: 480px) {
    align-self: stretch;
    text-align: center;
  }
`;

// ============================================
// ITEMS LIST
// ============================================
export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ItemCard = styled(motion.div)`
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  &:hover {
    transform: translateX(5px);
    background: var(--bg-hover);
    border-color: var(--primary-light);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const ItemIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--border-light);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

export const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const ItemMeta = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

export const StatusBadge = styled.span`
  background: ${(props) => {
    switch (props.$status) {
      case "completed":
        return "var(--success)";
      case "pending":
        return "var(--warning)";
      case "available":
        return "var(--primary)";
      default:
        return "var(--text-muted)";
    }
  }};
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-inverse);
  text-transform: capitalize;
  flex-shrink: 0;

  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
`;

// ============================================
// IMPACT CARDS
// ============================================
export const ImpactCard = styled(motion.div)`
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1rem;
  border-left: 4px solid ${(props) => props.$color || "var(--primary)"};
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    transform: scale(1.02);
    background: var(--bg-hover);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

export const ImpactIcon = styled.div`
  font-size: 1.75rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const ImpactContent = styled.div`
  flex: 1;

  .impact-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }

  .impact-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  @media (max-width: 480px) {
    .impact-label {
      font-size: 0.8rem;
    }

    .impact-value {
      font-size: 1.25rem;
    }
  }
`;

// ============================================
// QUICK LINKS
// ============================================
export const QuickLinksGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickLinkButton = styled(motion.button)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);

  span {
    font-size: 1.5rem;
  }

  &:hover {
    background: var(--gradient-primary);
    color: var(--text-inverse);
    border-color: var(--primary);
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);

    span {
      transform: scale(1.1);
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 0.95rem;

    span {
      font-size: 1.3rem;
    }
  }
`;

// ============================================
// FAB
// ============================================
export const FAB = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: var(--text-inverse);
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(27, 60, 83, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: all var(--transition-base);

  &:hover {
    box-shadow: 0 15px 50px rgba(27, 60, 83, 0.5);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 56px;
    height: 56px;
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
`;

// ============================================
// EMPTY STATE
// ============================================
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  p {
    font-size: 1rem;
    margin: 0.5rem 0;
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;

    .icon {
      font-size: 3rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

// ============================================
// LOADING
// ============================================
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;

  p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    p {
      font-size: 1rem;
    }
  }
`;

// ============================================
// EXPORT BUTTON
// ============================================
export const ExportButton = styled(motion.button)`
  background: var(--success);
  border: none;
  border-radius: var(--radius-md);
  padding: 0.4rem 0.8rem;
  color: var(--text-inverse);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
  }

  @media (max-width: 480px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }
`;