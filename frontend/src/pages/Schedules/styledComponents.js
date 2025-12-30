import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: var(--bg-primary);
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--bg-card);
  padding: 0.375rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
`;

const ViewButton = styled.button`
  padding: 0.625rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.$active ? "var(--primary)" : "transparent")};
  color: ${(props) => (props.$active ? "var(--text-inverse)" : "var(--text-secondary)")};

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--primary)" : "var(--bg-hover)"};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background: ${(props) => props.$gradient || "var(--gradient-primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: var(--bg-card);
  padding: 0.375rem;
  border-radius: var(--radius-lg);
  width: fit-content;
  border: 1px solid var(--border-color);
`;

const Tab = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  background: ${(props) => (props.$active ? "var(--bg-secondary)" : "transparent")};
  border: none;
  color: ${(props) =>
    props.$active ? "var(--text-primary)" : "var(--text-secondary)"};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-base);
  box-shadow: ${(props) => (props.$active ? "var(--shadow-sm)" : "none")};

  &:hover {
    color: var(--text-primary);
  }
`;

const TabCount = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  background: ${(props) =>
    props.$active ? "var(--primary)" : "var(--bg-secondary)"};
  color: ${(props) => (props.$active ? "var(--text-inverse)" : "var(--text-secondary)")};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 2px solid
    ${(props) => (props.$active ? "var(--primary)" : "var(--border-color)")};
  background: ${(props) =>
    props.$active ? "rgba(var(--primary-rgb), 0.1)" : "var(--bg-card)"};
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: var(--primary);
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled(motion.div)`
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
    transform: translateX(4px);
  }
`;

const ListItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  background: ${(props) =>
    props.$image ? `url(${props.$image})` : "var(--bg-secondary)"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 2px solid var(--border-color);
`;

const ListItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const StatusBadge = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.$status) {
      case "confirmed":
        return "var(--success-bg)";
      case "proposed":
        return "var(--warning-bg)";
      case "completed":
        return "var(--info-bg)";
      case "cancelled":
        return "var(--error-bg)";
      default:
        return "var(--bg-secondary)";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "confirmed":
        return "var(--success)";
      case "proposed":
        return "var(--warning)";
      case "completed":
        return "var(--info)";
      case "cancelled":
        return "var(--error)";
      default:
        return "var(--text-secondary)";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  background: ${(props) =>
    props.$primary
      ? "var(--gradient-primary)"
      : props.$success
      ? "var(--success)"
      : props.$danger
      ? "var(--error)"
      : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$primary || props.$success
      ? "var(--text-inverse)"
      : props.$danger
      ? "var(--text-inverse)"
      : "var(--text-primary)"};
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  margin: 0;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`;

const Spinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: var(--radius-full);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  
  p {
    margin-top: 1rem;
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

// Export all components
export {
  Container,
  Header,
  HeaderLeft,
  ViewToggle,
  ViewButton,
  StatsRow,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  Tabs,
  Tab,
  TabCount,
  FilterRow,
  FilterGroup,
  FilterButton,
  SortSelect,
  Grid,
  ListView,
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemMeta,
  StatusBadge,
  ActionButtons,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  LoadingSpinner,
  Spinner,
  LoadingContainer,
};