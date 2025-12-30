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

export const ProfileContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-primary);
  padding: 2rem;
  margin-top: 80px;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

export const ProfileCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

export const CoverPhoto = styled.div`
  height: 250px;
  background: var(--gradient-primary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>')
      no-repeat bottom;
    background-size: cover;
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const ProfileHeader = styled.div`
  position: relative;
  padding: 0 2rem 2rem;
  margin-top: -80px;
  display: flex;
  align-items: flex-end;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 1.5rem 1.5rem;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Avatar = styled.div`
  width: 160px;
  height: 160px;
  border-radius: var(--radius-full);
  border: 6px solid var(--bg-card);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-inverse);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    font-size: 3.5rem;
  }
`;

export const AvatarUpload = styled.label`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  font-size: 1.2rem;
  color: var(--text-inverse);

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-xl);
  }

  input {
    display: none;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  padding-top: 1rem;
`;

export const ProfileName = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const ProfileEmail = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ProfileBio = styled.p`
  font-size: 1rem;
  color: var(--text-tertiary);
  line-height: 1.6;
  margin: 0.5rem 0 1.5rem 0;
`;

export const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const ActionButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.$primary ? "var(--gradient-primary)" : "var(--bg-card)"};
  color: ${(props) =>
    props.$primary ? "var(--text-inverse)" : "var(--primary)"};
  border: 2px solid
    ${(props) => (props.$primary ? "transparent" : "var(--primary)")};
  border-radius: var(--radius-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    background: ${(props) =>
      props.$primary ? "var(--gradient-primary)" : "var(--primary)"};
    color: var(--text-inverse);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
  }
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 600;
`;

export const ContentTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 0 2rem;
  border-bottom: 2px solid var(--border-color);
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.button.withConfig({ shouldForwardProp })`
  padding: 1.25rem 2rem;
  background: transparent;
  border: none;
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: 700;
  cursor: pointer;
  position: relative;
  transition: all var(--transition-base);
  white-space: nowrap;

  &:hover {
    color: var(--primary);
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-primary);
      border-radius: 3px 3px 0 0;
    }
  `}
`;

export const TabContent = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all var(--transition-base);
  background: ${(props) =>
    props.disabled ? "var(--bg-secondary)" : "var(--bg-card)"};
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--text-muted);
  }
`;

export const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all var(--transition-base);
  background: var(--bg-card);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  cursor: pointer;
  background: var(--bg-card);
  color: var(--text-primary);
  transition: all var(--transition-base);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
`;

export const BadgesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
`;

export const BadgeCard = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  text-align: center;
  transition: all var(--transition-base);
  border: 2px solid
    ${(props) => (props.$unlocked ? "var(--primary)" : "var(--border-color)")};
  opacity: ${(props) => (props.$unlocked ? 1 : 0.5)};

  &:hover {
    transform: ${(props) => (props.$unlocked ? "translateY(-5px)" : "none")};
    box-shadow: ${(props) => (props.$unlocked ? "var(--shadow-lg)" : "none")};
  }
`;

export const BadgeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

export const BadgeName = styled.div`
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

export const BadgeDescription = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

export const RatingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const RatingCard = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  border-left: 4px solid var(--primary);
`;

export const RatingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const RaterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RaterAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

export const RaterName = styled.div`
  font-weight: 700;
  color: var(--text-primary);
`;

export const RatingDate = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

export const Stars = styled.div`
  font-size: 1.2rem;
  color: var(--warning);
`;

export const RatingComment = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-style: italic;
`;

export const MessageBox = styled.div`
  padding: 1rem 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
  background: ${(props) =>
    props.$type === "error" ? "var(--error-bg)" : "var(--success-bg)"};
  color: ${(props) =>
    props.$type === "error" ? "var(--error)" : "var(--success)"};
  border-left: 4px solid
    ${(props) => (props.$type === "error" ? "var(--error)" : "var(--success)")};
  font-weight: 600;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const HistorySection = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-top: 1rem;
  border: 1px solid var(--border-color);
`;

export const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  &:last-child {
    border-bottom: none;
  }
`;

export const ItemDetails = styled.div`
  flex: 1;
`;

export const ItemTitle = styled.h3`
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

export const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

export const ReceiptButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--gradient-primary);
  color: var(--text-inverse);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

export const ReceiptModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  color: var(--text-primary);
`;

export const ReceiptHeader = styled.div`
  background: var(--bg-card);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: 1.5rem;
  width: 400px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-bottom: none;
`;

export const ReceiptBody = styled.div`
  background: var(--bg-card);
  padding: 1.5rem;
  width: 400px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  border: 1px solid var(--border-color);
  border-top: none;
`;

export const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border-color);
`;
