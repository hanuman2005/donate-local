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
`;

export const ProfileCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
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
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Avatar = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 6px solid var(--bg-card);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-button);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarUpload = styled.label`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
  font-size: 1.2rem;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
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
    props.$primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$primary ? "white" : "#667eea")};
  border: 2px solid ${(props) => (props.$primary ? "transparent" : "#667eea")};
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    background: ${(props) =>
      props.$primary
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "#667eea"};
    color: white;
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
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
`;

export const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.95rem;
  color: #718096;
  font-weight: 600;
`;

export const ContentTabs = styled.div`
  display: flex;
  gap: 0;
  padding: 0 2rem;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Tab = styled.button.withConfig({ shouldForwardProp })`
  padding: 1.25rem 2rem;
  background: transparent;
  border: none;
  color: ${(props) => (props.$active ? "#667eea" : "#718096")};
  font-weight: 700;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    color: #667eea;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px 3px 0 0;
    }
  `}
`;

export const TabContent = styled.div`
  padding: 2rem;
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
  color: #4a5568;
  font-size: 0.95rem;
`;

export const Input = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: ${(props) => (props.disabled ? "#f7fafc" : "white")};

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    color: #a0aec0;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const Select = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  background: white;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const BadgesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
`;

export const BadgeCard = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid ${(props) => (props.$unlocked ? "#667eea" : "#e2e8f0")};
  opacity: ${(props) => (props.$unlocked ? 1 : 0.5)};

  &:hover {
    transform: ${(props) => (props.$unlocked ? "translateY(-5px)" : "none")};
    box-shadow: ${(props) =>
      props.$unlocked ? "0 10px 30px rgba(102, 126, 234, 0.2)" : "none"};
  }
`;

export const BadgeIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

export const BadgeName = styled.div`
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

export const BadgeDescription = styled.div`
  font-size: 0.85rem;
  color: #718096;
`;

export const RatingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const RatingCard = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
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
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;

export const RaterName = styled.div`
  font-weight: 700;
  color: #2d3748;
`;

export const RatingDate = styled.div`
  font-size: 0.85rem;
  color: #a0aec0;
`;

export const Stars = styled.div`
  font-size: 1.2rem;
  color: #fbbf24;
`;

export const RatingComment = styled.p`
  color: #4a5568;
  line-height: 1.6;
  font-style: italic;
`;

export const MessageBox = styled.div`
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  background: ${(props) => (props.$type === "error" ? "#fed7d7" : "#c6f6d5")};
  color: ${(props) => (props.$type === "error" ? "#c53030" : "#2f855a")};
  border-left: 4px solid
    ${(props) => (props.$type === "error" ? "#e53e3e" : "#48bb78")};
  font-weight: 600;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// ===== Additional Components for Donations & Receipts =====

export const HistorySection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

export const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  &:last-child {
    border-bottom: none;
  }
`;

export const ItemDetails = styled.div`
  flex: 1;
`;

export const ItemTitle = styled.h3`
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 0.25rem;
`;

export const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #718096;
`;

export const ReceiptButton = styled.button.withConfig({ shouldForwardProp })`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

export const ReceiptModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
  color: #2d3748;
`;

export const ReceiptHeader = styled.div`
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 1.5rem;
  width: 400px;
  text-align: center;
`;

export const ReceiptBody = styled.div`
  background: white;
  padding: 1.5rem;
  width: 400px;
  border-radius: 0 0 12px 12px;
`;

export const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px dashed #e2e8f0;
`;
