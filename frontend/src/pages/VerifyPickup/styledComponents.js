// src/pages/VerifyPickup/styledComponents.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: #718096;
  font-size: 1.1rem;
  font-weight: 500;
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Tab = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.$active ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  ` : `
    background: transparent;
    color: #718096;

    &:hover {
      background: #f7fafc;
      color: #4a5568;
    }
  `}
`;

export const ContentWrapper = styled.div`
  position: relative;
`;

export const TabContent = styled.div`
  display: ${props => props.$active ? 'block' : 'none'};
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const HistoryList = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  background: #f7fafc;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HistoryIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

export const HistoryDetails = styled.div`
  flex: 1;
`;

export const HistoryTitle = styled.h4`
  color: #2d3748;
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
`;

export const HistoryDate = styled.p`
  color: #a0aec0;
  font-size: 0.9rem;
  margin: 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  h3 {
    color: #2d3748;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #718096;
    font-size: 1rem;
  }
`;