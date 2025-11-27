// src/pages/Listings/styledComponents.js - ENHANCED WITH FILTERS & MAP
import styled from "styled-components";

export const ListingsContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 80px;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// ✅ NEW: View Toggle Buttons
export const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ToggleButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'transparent'};
  color: ${props => props.$active ? 'white' : '#718096'};

  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : '#f7fafc'};
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
`;

// ✅ NEW: Content Wrapper
export const ContentWrapper = styled.div`
  margin-top: 2rem;
`;

// ✅ NEW: Map Wrapper
export const MapWrapper = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 15px;
  }
`;

export const Grid = styled.div`
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

export const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  filter: grayscale(30%);

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

export const EmptyText = styled.div`
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const EmptySubtext = styled.div`
  font-size: 1rem;
  color: #a0aec0;
  line-height: 1.6;
`;

export const RetryButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const LoadingContainer = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

// ✅ NEW: Pagination Controls
export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
`;

export const PageButton = styled.button`
  padding: 0.75rem 2rem;
  background: ${props => props.disabled 
    ? '#e2e8f0' 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: ${props => props.disabled ? '#a0aec0' : 'white'};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.disabled 
    ? 'none' 
    : '0 4px 15px rgba(102, 126, 234, 0.3)'};

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled 
      ? 'none' 
      : '0 8px 20px rgba(102, 126, 234, 0.4)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PageInfo = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 150px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;