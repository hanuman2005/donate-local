import styled from "styled-components";

export const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 80px; /* Match header height */
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const DashboardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

export const WelcomeSection = styled.div`
  flex: 1;
`;

export const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.5;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const ActionButton = styled.button`
  background: ${(props) =>
    props.$primary ? "#ff6b6b" : "rgba(255, 255, 255, 0.2)"};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 24px;
  border: ${(props) =>
    props.$primary ? "none" : "2px solid rgba(255, 255, 255, 0.3)"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${(props) =>
      props.$primary ? "#ff5252" : "rgba(255, 255, 255, 0.3)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

export const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
`;

export const DashboardContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Section = styled.section`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
`;

export const ViewAllButton = styled.button`
  background: transparent;
  color: #667eea;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  background: #f8fafc;
  border-radius: 8px;
  padding: 4px;
`;

export const Tab = styled.button`
  background: ${(props) => (props.$active ? "white" : "transparent")};
  color: ${(props) => (props.$active ? "#667eea" : "#64748b")};
  font-size: 0.9rem;
  font-weight: 600;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$active ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: #667eea;
  }
`;

export const TabContent = styled.div`
  padding: 2rem;
`;

export const MapContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
`;

export const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyStateText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #64748b;
`;
