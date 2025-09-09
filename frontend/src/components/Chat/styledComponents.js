import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: ${props => props.compact ? 'block' : 'flex'};
  height: ${props => props.compact ? 'auto' : '600px'};
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const ChatSidebar = styled.div`
  width: 300px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f7fafc;
  position: relative;
  background: ${props => props.active ? '#f7fafc' : 'transparent'};

  &:hover {
    background: #f7fafc;
  }

  ${props => props.active && `
    background: #edf2f7;
    border-left: 3px solid #4facfe;
  `}
`;

export const ChatAvatar = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ChatName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

export const ChatLastMessage = styled.div`
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ChatTime = styled.div`
  color: #a0aec0;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const ChatBadge = styled.div`
  background: #4facfe;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

export const ChatHeaderInfo = styled.div`
  flex: 1;
`;

export const ChatHeaderName = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
`;

export const ChatHeaderStatus = styled.div`
  color: #48bb78;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin-bottom: 0.5rem;
`;

export const MessageContent = styled.div`
  background: ${props => props.isOwn ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : '#f7fafc'};
  color: ${props => props.isOwn ? 'white' : '#2d3748'};
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 0.95rem;
  
  ${props => props.isOwn ? `
    border-bottom-right-radius: 4px;
  ` : `
    border-bottom-left-radius: 4px;
  `}
`;

export const MessageTime = styled.div`
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.25rem;
  padding: 0 0.5rem;
`;

export const InputContainer = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: 1rem 1.5rem;
  background: white;
`;

export const MessageInput = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  background: #f8fafc;
  border-radius: 20px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: #4facfe;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
  }
`;

export const MessageTextarea = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  padding: 8px 12px;
  font-size: 0.95rem;
  line-height: 1.4;
  max-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

export const SendButton = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
  padding: 2rem;

  h3 {
    margin: 0.5rem 0;
    color: #4a5568;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;