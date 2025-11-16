// client/src/pages/Notifications/styledComponents.js - COMPLETE & OPTIMIZED
import styled from "styled-components";

export const NotificationsContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  margin-top: 80px;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

export const Header = styled.div`
  max-width: 900px;
  margin: 0 auto 2.5rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  line-height: 1.2;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.9rem;
    gap: 0.75rem;
  }
`;

export const UnreadBadge = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.35rem 0.875rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  display: inline-block;

  @media (max-width: 768px) {
    padding: 0.3rem 0.75rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
  }
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
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    width: 100%;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.75rem;
    width: 100%;
  }
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
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    flex: 1;
    min-width: calc(50% - 0.375rem);
  }
`;

export const NotificationsList = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.875rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

export const DateGroup = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

export const DateLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  padding-left: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
  }
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
    opacity: 1;
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

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
    border-radius: 12px;
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
  line-height: 1;

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    border-radius: 10px;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const NotificationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  line-height: 1.3;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const NotificationTime = styled.span`
  font-size: 0.85rem;
  color: #a0aec0;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export const NotificationMessage = styled.p`
  font-size: 0.95rem;
  color: #4a5568;
  margin: 0.5rem 0;
  line-height: 1.6;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.5;
  }
`;

export const NotificationActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
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
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.875rem;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
    flex: 1;
    min-width: fit-content;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 3.5rem 1.5rem;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 3rem 1rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  line-height: 1;
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

  @media (max-width: 768px) {
    font-size: 4.5rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;

export const EmptyText = styled.h3`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export const EmptySubtext = styled.p`
  color: #a0aec0;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;

  @media (max-width: 480px) {
    min-height: 300px;
  }
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

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
`;