// ============================================
// src/pages/Notifications/styledComponents.js
// ============================================
import styled from 'styled-components';

export const NotificationsContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  margin-top: 80px;  /* ✅ Match header height */
  padding: 2rem 1rem;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;



export const NotificationsCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const Header = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const UnreadBadge = styled.span`
  background: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

export const MarkAllButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const FilterButton = styled.button`
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  color: white;
  border: 2px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const NotificationsList = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const NotificationItem = styled.div`
  background: ${props => props.$read ? 'white' : '#f0f9ff'};
  border-left: 4px solid ${props => props.$read ? 'transparent' : '#667eea'};
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const NotificationIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
`;

export const NotificationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #a0aec0;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const NotificationMessage = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

export const NotificationSender = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const SenderAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SenderName = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyStateText = styled.h3`
  font-size: 1.25rem;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`;