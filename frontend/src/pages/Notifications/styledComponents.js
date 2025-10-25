import styled from "styled-components";

export const NotificationsContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  margin-top: 80px;
`;

export const Header = styled.div`
  max-width: 900px;
  margin: 0 auto 2rem;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const UnreadBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
`;

export const MarkAllButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
    transform: translateY(-2px);
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$active ? "white" : "#4a5568")};
  border: 2px solid ${(props) => (props.$active ? "transparent" : "#e2e8f0")};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const NotificationsList = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DateGroup = styled.div`
  margin-bottom: 2rem;
`;

export const DateLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
`;

export const NotificationCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  align-items: start;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid ${(props) => (props.$read ? "transparent" : "#667eea")};
  opacity: ${(props) => (props.$read ? 0.7 : 1)};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: ${(props) => (props.$read ? 0 : 1)};
  }
`;

export const NotificationIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => {
    const colors = {
      message: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      interest: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      assignment: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      completion: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      system: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    };
    return colors[props.type] || colors.system;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

export const NotificationContent = styled.div`
  flex: 1;
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
`;

export const NotificationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

export const NotificationTime = styled.span`
  font-size: 0.85rem;
  color: #a0aec0;
  white-space: nowrap;
`;

export const NotificationMessage = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  margin: 0.5rem 0;
  line-height: 1.6;
`;

export const NotificationActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

export const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#f7fafc"};
  color: ${(props) => (props.$primary ? "white" : "#4a5568")};
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }
`;

export const EmptyText = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

export const EmptySubtext = styled.p`
  color: #a0aec0;
  font-size: 1rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

export const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
