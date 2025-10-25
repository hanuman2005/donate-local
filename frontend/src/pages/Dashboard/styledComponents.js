import styled from "styled-components";

export const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
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
    padding: 1rem;
  }
`;

export const DashboardHeader = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
`;

export const WelcomeSection = styled.div`
  flex: 1;
`;

export const WelcomeTitle = styled.h1`
  color: white;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const WelcomeSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const ActionButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: white;
    color: #667eea;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  border-radius: 16px;
  box-shadow: ${(props) => shadows[props.$variant] || shadows.purple};
  transition: all 0.3s ease;
  cursor: pointer;

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
`;

export const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
`;

export const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MainSection = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Section = styled.section`
  background: ${(props) =>
    props.$impact
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$impact ? "white" : "inherit")};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => (props.$impact ? "white" : "#2d3748")};

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const GradientText = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  background: ${(props) => gradients[props.$variant] || gradients.purple};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const ViewAllButton = styled.button`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f7fafc;
  border-radius: 12px;
  padding: 0.3rem;
`;

export const Tab = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "#4a5568")};

  &:hover {
    ${(props) =>
      !props.$active &&
      `
      background: #e2e8f0;
    `}
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
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
  }
`;

export const MapContainer = styled.div`
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const EmptyState = styled.div`
  background: #f7fafc;
  border-radius: ${(props) => (props.$compact ? "12px" : "16px")};
  padding: ${(props) => (props.$compact ? "2rem" : "3rem")};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const EmptyStateIcon = styled.div`
  font-size: ${(props) => (props.$small ? "2.5rem" : "4rem")};
  margin-bottom: 1rem;
`;

export const EmptyStateText = styled.p`
  color: ${(props) => (props.$large ? "#2d3748" : "#718096")};
  font-size: ${(props) => {
    if (props.$large) return "1.2rem";
    if (props.$small) return "0.85rem";
    return "1rem";
  }};
  margin-bottom: ${(props) => (props.$large ? "0.5rem" : "0")};
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
  color: #718096;
  font-size: 1.1rem;
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
`;

export const ImpactText = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
`;

export const ImpactValue = styled.strong`
  font-weight: 800;
  color: white;
`;