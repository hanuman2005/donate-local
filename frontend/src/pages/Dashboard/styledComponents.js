// src/pages/Dashboard/styledComponents.js - COMPLETE ENHANCED VERSION
import styled from "styled-components";
import { motion } from "framer-motion";

export const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 2rem;
  transition: all var(--transition-base);

  @media (max-width: 768px) {
    padding: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const WelcomeCard = styled.div`
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -10%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1), transparent);
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

export const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

export const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.8rem;
    }
    p {
      font-size: 0.95rem;
    }
  }
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const ActionBtn = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  `
      : `
    background: var(--bg-card);
    color: var(--primary);
    border: 2px solid var(--primary);
  `}

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    width: 300px;
    height: 300px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.65rem 1.25rem;
  }
`;

export const StatsGrid = styled.div`
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
  padding: 1.75rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $color }) =>
      $color || "linear-gradient(90deg, #667eea, #764ba2)"};
  }

  &::after {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }

  &:hover::after {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const MainContent = styled.main`
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
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

export const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 1.3rem;
    }
  }
`;

export const ViewAllBtn = styled(motion.button)`
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);

  &:hover {
    background: var(--bg-hover);
  }
`;

export const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ItemCard = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${({ $status }) =>
    $status === "completed" ? "rgba(34, 197, 94, 0.1)" : "var(--bg-secondary)"};
  border-radius: var(--radius-lg);
  border: 2px solid
    ${({ $status }) =>
      $status === "completed"
        ? "#22c55e"
        : $status === "pending"
        ? "#667eea"
        : "var(--border-color)"};
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${({ $status }) =>
      $status === "completed"
        ? "#22c55e"
        : $status === "pending"
        ? "#667eea"
        : "transparent"};
  }

  &:hover {
    transform: translateX(8px);
    box-shadow: var(--shadow-md);
  }
`;

export const ItemIcon = styled.div`
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: var(--shadow-sm);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
`;

export const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 1rem;
`;

export const ItemMeta = styled.div`
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $status }) =>
    $status === "completed"
      ? "var(--success-bg)"
      : $status === "pending"
      ? "var(--warning-bg)"
      : $status === "failed"
      ? "var(--danger-bg)"
      : "var(--gradient-primary)"};
  color: var(--text-inverse);
  text-transform: capitalize;
`;

export const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const InsightCard = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.2), transparent);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  &:hover {
    transform: translateX(4px);
    box-shadow: var(--shadow-sm);
  }
`;

export const InsightIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

export const InsightContent = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;

  h3 {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--border-color);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    margin-top: 0;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;

    .icon {
      font-size: 3rem;
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--text-primary);
  gap: 1rem;

  p {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    p {
      font-size: 1rem;
    }
  }
`;

// ========== NEW ENHANCED COMPONENTS ==========

export const QuickActionCard = styled(motion.div)`
  background: linear-gradient(135deg, ${(props) => props.$gradient});
  padding: 2rem;
  border-radius: var(--radius-xl);
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  }

  h3 {
    font-size: 1.3rem;
    margin: 0.5rem 0;
    font-weight: 700;
  }

  p {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.1rem;
    min-height: 120px;

    .icon {
      font-size: 2rem;
    }

    h3 {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.7rem;
    min-height: 90px;
    border-radius: var(--radius-lg);
    h3 {
      font-size: 0.95rem;
    }
    .icon {
      font-size: 1.3rem;
    }
  }
`;

export const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.7rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }
`;

export const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;

  &::before {
    content: "";
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, var(--primary), transparent);
  }
`;

export const TimelineItem = styled(motion.div)`
  position: relative;
  padding-bottom: 2rem;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: "${(props) => props.$icon}";
    position: absolute;
    left: -1.75rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 0 0 4px var(--bg-card);
    z-index: 1;
  }

  &:hover::before {
    transform: scale(1.2);
    transition: transform 0.3s;
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Badge = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 2px solid
    ${(props) => (props.$unlocked ? props.$color : "var(--border-color)")};
  opacity: ${(props) => (props.$unlocked ? 1 : 0.5)};
  cursor: pointer;
  min-width: 100px;
  transition: all var(--transition-base);

  &:hover {
    transform: scale(1.1);
  }

  .badge-icon {
    font-size: 2.5rem;
    filter: ${(props) => (props.$unlocked ? "none" : "grayscale(100%)")};
  }

  .badge-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    min-width: 80px;
    padding: 0.75rem;

    .badge-icon {
      font-size: 2rem;
    }
  }
`;

export const ProgressRing = styled.div`
  width: ${(props) => props.$size || "100px"};
  height: ${(props) => props.$size || "100px"};
  border-radius: 50%;
  background: conic-gradient(
    var(--primary) ${(props) => props.$progress * 3.6}deg,
    var(--border-color) ${(props) => props.$progress * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    width: 80%;
    height: 80%;
    border-radius: 50%;
    background: var(--bg-card);
  }

  .progress-value {
    position: relative;
    z-index: 1;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }
`;

export const FAB = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
`;

export const GradientHeader = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;

  &::after {
    content: "";
    display: block;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    margin-top: 0.5rem;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;
