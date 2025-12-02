// client/src/pages/Dashboard/styledComponents.js - COMPLETE FILE FOR SIDEBAR LAYOUT
import styled from "styled-components";

export const DashboardContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 2rem;
  transition: all var(--transition-base);
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

export const DashboardHeader = styled.header`
  background: var(--gradient-primary);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    gap: 1.5rem;
    border-radius: var(--radius-lg);
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

export const WelcomeSection = styled.div`
  flex: 1;
  min-width: 0;
`;

export const WelcomeTitle = styled.h1`
  color: white;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const WelcomeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const ActionButton = styled.button`
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;

  ${(props) =>
    props.$primary
      ? `
    background: white;
    color: var(--primary);
    box-shadow: var(--shadow-md);

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `}

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  animation: slideUp 0.6s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
  }
`;

const gradients = {
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  pink: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  blue: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  green: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  orange: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
};

const shadows = {
  purple: "0 8px 25px rgba(102, 126, 234, 0.3)",
  pink: "0 8px 25px rgba(240, 147, 251, 0.3)",
  blue: "0 8px 25px rgba(79, 172, 254, 0.3)",
  green: "0 8px 25px rgba(67, 233, 123, 0.3)",
  orange: "0 8px 25px rgba(250, 112, 154, 0.3)",
};

export const StatCard = styled.div`
  background: ${(props) => gradients[props.$variant] || gradients.purple};
  color: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: ${(props) => shadows[props.$variant] || shadows.purple};
  transition: all var(--transition-base);
  cursor: pointer;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${(props) => {
      const variant = props.$variant || "purple";
      return shadows[variant].replace("0.3)", "0.4)");
    }};
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: 100px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    min-height: 90px;
  }
`;

export const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

export const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 300px;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const MainSection = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;

export const Section = styled.section`
  background: ${(props) =>
    props.$impact ? "var(--gradient-primary)" : "var(--bg-card)"};
  color: ${(props) => (props.$impact ? "white" : "var(--text-primary)")};
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: var(--radius-lg);
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
    gap: 0.75rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => (props.$impact ? "white" : "var(--text-primary)")};
  line-height: 1.2;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const GradientText = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  background: ${(props) => gradients[props.$variant] || gradients.purple};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const ViewAllButton = styled.button`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: var(--radius-lg);
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
  transition: all var(--transition-base);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 0.3rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    padding: 0.25rem;
    gap: 0.4rem;
  }
`;

export const Tab = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
  background: ${(props) =>
    props.$active ? "var(--gradient-primary)" : "transparent"};
  color: ${(props) => (props.$active ? "white" : "var(--text-secondary)")};
  white-space: nowrap;

  &:hover {
    ${(props) =>
      !props.$active &&
      `
      background: var(--bg-hover);
    `}
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.45rem 0.8rem;
    font-size: 0.8rem;
  }
`;

export const TabContent = styled.div`
  animation: fadeIn 0.3s ease;
`;

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const MapContainer = styled.div`
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  @media (max-width: 480px) {
    border-radius: var(--radius-md);
  }
`;

export const EmptyState = styled.div`
  background: ${(props) =>
    props.$compact ? "transparent" : "var(--bg-secondary)"};
  border-radius: ${(props) =>
    props.$compact ? "var(--radius-md)" : "var(--radius-lg)"};
  padding: ${(props) => (props.$compact ? "2rem" : "3rem")};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: ${(props) => (props.$compact ? "1.5rem" : "2.5rem")};
  }

  @media (max-width: 480px) {
    padding: ${(props) => (props.$compact ? "1.25rem" : "2rem")};
  }
`;

export const EmptyStateIcon = styled.div`
  font-size: ${(props) => (props.$small ? "2.5rem" : "4rem")};
  margin-bottom: 1rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: ${(props) => (props.$small ? "2.2rem" : "3.5rem")};
  }

  @media (max-width: 480px) {
    font-size: ${(props) => (props.$small ? "2rem" : "3rem")};
  }
`;

export const EmptyStateText = styled.p`
  color: ${(props) =>
    props.$large ? "var(--text-primary)" : "var(--text-secondary)"};
  font-size: ${(props) => {
    if (props.$large) return "1.2rem";
    if (props.$small) return "0.85rem";
    return "1rem";
  }};
  margin-bottom: ${(props) => (props.$large ? "0.5rem" : "0")};
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${(props) => {
      if (props.$large) return "1.1rem";
      if (props.$small) return "0.8rem";
      return "0.95rem";
    }};
  }
`;

export const LoadingContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
`;

export const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ImpactStat = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ImpactIcon = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const ImpactText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const ImpactValue = styled.strong`
  font-weight: 800;
  color: white;
`;
