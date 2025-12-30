// client/src/pages/Notifications/styledComponents.js - Updated with Theme Variables
import styled from "styled-components";

// Framer Motion props that should not be forwarded to the DOM
const motionProps = [
  "initial",
  "animate",
  "exit",
  "variants",
  "transition",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "layout",
  "layoutId",
  "onAnimationStart",
  "onAnimationComplete",
];
const shouldForwardProp = (prop) => !motionProps.includes(prop);

export const NotificationsContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-primary);
  color: var(--text-primary);
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
  color: var(--text-primary);
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
  background: var(--gradient-primary);
  color: var(--text-inverse);
  padding: 0.35rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  display: inline-block;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    padding: 0.3rem 0.75rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
  }
`;

export const MarkAllButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--primary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    background: var(--primary);
    color: var(--text-inverse);
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
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

export const FilterButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.$active ? "var(--gradient-primary)" : "var(--bg-card)"};
  color: ${(props) =>
    props.$active ? "var(--text-inverse)" : "var(--text-primary)"};
  border: 2px solid
    ${(props) => (props.$active ? "transparent" : "var(--border-color)")};
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
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
  color: var(--primary);
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
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  gap: 1.5rem;
  align-items: start;
  cursor: pointer;
  transition: all var(--transition-base);
  border-left: 4px solid
    ${(props) => (props.$read ? "transparent" : "var(--primary)")};
  opacity: ${(props) => (props.$read ? 0.7 : 1)};
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-xl);
    opacity: 1;
    border-color: var(--primary-light);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
    border-radius: var(--radius-lg);
  }
`;

export const NotificationIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  background: ${(props) => {
    const colors = {
      message: "var(--gradient-primary)",
      interest: "var(--gradient-primary)",
      assignment: "var(--gradient-primary)",
      completion: "var(--gradient-primary)",
      system: "var(--gradient-primary)",
    };
    return colors[props.type] || colors.system;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  line-height: 1;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.35rem;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    border-radius: var(--radius-md);
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
  color: var(--text-primary);
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
  color: var(--text-tertiary);
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
  color: var(--text-secondary);
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

export const ActionButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.$primary ? "var(--gradient-primary)" : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$primary ? "var(--text-inverse)" : "var(--text-primary)"};
  border: ${(props) =>
    props.$primary ? "none" : `1px solid var(--border-color)`};
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
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
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 3.5rem 1.5rem;
    border-radius: var(--radius-lg);
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
  color: var(--text-primary);
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
  color: var(--text-secondary);
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
  border: 4px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: var(--radius-full);
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
