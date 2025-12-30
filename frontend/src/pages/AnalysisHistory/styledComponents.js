import styled from "styled-components";
import { motion } from "framer-motion";

export const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 8rem 2rem 4rem;
  position: relative;
  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
    text-shadow: var(--shadow-md);
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  p {
    font-size: 1.2rem;
    color: var(--text-secondary);
    opacity: 0.95;
    margin: 0;
  }
`;

export const StatsBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

export const StatCard = styled(motion.div)`
  background: var(--bg-card);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  text-align: center;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  transition: all var(--transition-base);
  
  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  .value {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .label {
    font-size: 0.95rem;
    color: var(--text-secondary);
    opacity: 0.9;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const AnalysisCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  .icon {
    font-size: 3rem;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gradient-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    color: var(--text-inverse);
  }
  
  .info {
    flex: 1;
    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }
    .material {
      display: inline-block;
      background: var(--gradient-primary);
      color: var(--text-inverse);
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
    }
  }
`;

export const CardBody = styled.div`
  display: grid;
  gap: 0.75rem;
  
  .row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--bg-hover);
    }
    
    .label {
      color: var(--text-secondary);
      font-weight: 600;
    }
    .value {
      color: var(--text-primary);
      font-weight: 700;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  
  .icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
    color: var(--text-secondary);
  }
  
  h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }
  
  button {
    background: var(--bg-card);
    color: var(--primary);
    padding: 1rem 2rem;
    border: 2px solid var(--primary);
    border-radius: var(--radius-lg);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-base);
    
    &:hover {
      background: var(--primary);
      color: var(--text-inverse);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
`;

export const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  color: var(--primary);
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 5px solid var(--border-color);
    border-top-color: var(--primary);
    border-radius: var(--radius-full);
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;