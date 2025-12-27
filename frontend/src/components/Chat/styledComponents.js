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

export const ChatContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => (props.$compact ? "1fr" : "350px 1fr")};
  height: ${(props) => (props.$compact ? "auto" : "calc(100vh - 120px)")};
  max-width: 1400px;
  margin: 2rem auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    height: calc(100vh - 80px);
    margin: 1rem;
  }
`;

export const Sidebar = styled.div`
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 968px) {
    display: ${(props) => (props.$hidden ? "none" : "flex")};
  }
`;

export const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
`;

export const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.95rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.8);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
  }
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "transparent"};
  color: ${(props) => (props.$active ? "white" : "#2d3748")};
  margin-bottom: 0.5rem;
  position: relative;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "#f7fafc"};
    transform: translateX(5px);
  }
`;

export const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active
      ? "white"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: ${(props) => (props.$active ? "#667eea" : "white")};
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #48bb78;
  border: 2px solid white;
  border-radius: 50%;
`;

export const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LastMessage = styled.div`
  font-size: 0.85rem;
  opacity: ${(props) => (props.$active ? 0.9 : 0.6)};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ChatMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const TimeStamp = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

export const UnreadBadge = styled.div`
  background: ${(props) => (props.$active ? "white" : "#667eea")};
  color: ${(props) => (props.$active ? "#667eea" : "white")};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
`;

export const MainChat = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  position: relative;
  height: 100%;
  overflow: hidden;

  @media (max-width: 968px) {
    display: ${(props) => (props.$hidden ? "none" : "flex")};
  }
`;

export const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
  flex-shrink: 0;
`;

export const BackButton = styled.button.withConfig({ shouldForwardProp })`
  display: none;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;

  @media (max-width: 968px) {
    display: block;
  }
`;

export const HeaderInfo = styled.div`
  flex: 1;
`;

export const HeaderName = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3748;
`;

export const HeaderStatus = styled.div`
  font-size: 0.85rem;
  color: ${(props) => (props.$online ? "#48bb78" : "#a0aec0")};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${(props) => (props.$online ? "#48bb78" : "#a0aec0")};
    border-radius: 50%;
    display: inline-block;
  }
`;

export const TypingIndicator = styled.div`
  font-size: 0.85rem;
  color: #667eea;
  font-style: italic;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }
`;

export const DateDivider = styled.div`
  text-align: center;
  margin: 2rem 0 1rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e2e8f0;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
    background: white;
    padding: 0.5rem 1rem;
    color: #a0aec0;
    font-size: 0.85rem;
    font-weight: 600;
    border-radius: 20px;
  }
`;

export const MessageBubble = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  flex-direction: ${(props) => (props.$isOwn ? "row-reverse" : "row")};
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
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

export const MessageAvatar = styled(Avatar)`
  width: 35px;
  height: 35px;
  font-size: 0.9rem;
`;

export const MessageContent = styled.div`
  max-width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: ${(props) => (props.$isOwn ? "flex-end" : "flex-start")};

  @media (max-width: 768px) {
    max-width: 75%;
  }
`;

export const MessageText = styled.div`
  background: ${(props) =>
    props.$isOwn
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "white"};
  color: ${(props) => (props.$isOwn ? "white" : "#2d3748")};
  padding: 0.875rem 1.25rem;
  border-radius: ${(props) =>
    props.$isOwn ? "20px 20px 4px 20px" : "20px 20px 20px 4px"};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  position: relative;
  line-height: 1.5;

  ${(props) =>
    props.$pending &&
    `
    opacity: 0.7;
    &::after {
      content: '⏳';
      margin-left: 0.5rem;
    }
  `}

  ${(props) =>
    props.$failed &&
    `
    opacity: 0.5;
    border: 2px solid #e53e3e;
    &::after {
      content: '❌ Failed';
      font-size: 0.75rem;
      color: #e53e3e;
      margin-left: 0.5rem;
    }
  `}
`;

export const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #a0aec0;
  padding: 0 0.25rem;
`;

export const InputArea = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
`;

export const InputForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

export const InputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-size: 0.95rem;
  font-family: inherit;
  max-height: 120px;
  min-height: 24px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const IconButton = styled.button.withConfig({ shouldForwardProp })`
  background: transparent;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.6;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button.withConfig({ shouldForwardProp })`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  color: #a0aec0;
`;

export const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
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
`;

export const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: #a0aec0;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
