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
  background: var(--bg-card);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-card);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    height: calc(100vh - 80px);
    margin: 1rem;
  }
`;

export const Sidebar = styled.div`
  background: var(--bg-card);
  border-right: 1px solid var(--border);
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
  background: var(--gradient-primary);
  color: var(--text-on-primary);
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
  border: 2px solid var(--input-border);
  border-radius: 12px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.95rem;

  &::placeholder {
    color: var(--text-placeholder);
  }

  &:focus {
    outline: none;
    background: var(--input-bg-focus);
    border-color: var(--input-border-focus);
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
    background: var(--scrollbar-thumb);
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
    props.$active ? "var(--gradient-primary)" : "transparent"};
  color: ${(props) =>
    props.$active ? "var(--text-on-primary)" : "var(--text-primary)"};
  margin-bottom: 0.5rem;
  position: relative;

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--gradient-primary)" : "var(--bg-hover)"};
    transform: translateX(5px);
  }
`;

export const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active ? "var(--bg-card)" : "var(--gradient-primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-on-primary)"};
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
  background: var(--success);
  border: 2px solid var(--bg-card);
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
  background: ${(props) =>
    props.$active ? "var(--bg-card)" : "var(--primary)"};
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-on-primary)"};
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
  background: var(--bg-card);
  position: relative;
  height: 100%;
  overflow: hidden;

  @media (max-width: 968px) {
    display: ${(props) => (props.$hidden ? "none" : "flex")};
  }
`;

export const ChatHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-card);
  box-shadow: var(--shadow-card);
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
  color: var(--text-primary);
`;

export const HeaderStatus = styled.div`
  font-size: 0.85rem;
  color: ${(props) =>
    props.$online ? "var(--success)" : "var(--text-secondary)"};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    background: ${(props) =>
      props.$online ? "var(--success)" : "var(--text-secondary)"};
    border-radius: 50%;
    display: inline-block;
  }
`;

export const TypingIndicator = styled.div`
  font-size: 0.85rem;
  color: var(--primary);
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
  background: var(--bg-chat-gradient);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
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
    props.$isOwn ? "var(--gradient-primary)" : "var(--bg-card)"};
  color: ${(props) =>
    props.$isOwn ? "var(--text-on-primary)" : "var(--text-primary)"};
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
    border: 2px solid var(--danger);
    &::after {
      content: '❌ Failed';
      font-size: 0.75rem;
      color: var(--danger);
      margin-left: 0.5rem;
    }
  `}
`;

export const MessageTime = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
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
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  border-radius: 24px;
  transition: all 0.2s;

  &:focus-within {
    border-color: var(--primary);
    background: var(--bg-card);
    box-shadow: var(--shadow-input-focus);
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
    color: var(--text-placeholder);
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
  background: var(--gradient-primary);
  border: none;
  color: var(--text-on-primary);
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: var(--shadow-button-hover);
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
  color: var(--text-secondary);
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
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

export const EmptyText = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
