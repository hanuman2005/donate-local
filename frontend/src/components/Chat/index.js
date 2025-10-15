import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { chatAPI } from "../../services/api";
import {
  ChatContainer,
  ChatSidebar,
  ChatList,
  ChatItem,
  ChatAvatar,
  ChatInfo,
  ChatName,
  ChatLastMessage,
  ChatTime,
  ChatBadge,
  ChatMain,
  ChatHeader,
  ChatHeaderInfo,
  ChatHeaderName,
  ChatHeaderStatus,
  MessagesContainer,
  MessageGroup,
  MessageBubble,
  MessageContent,
  MessageTime,
  MessageInput,
  InputContainer,
  MessageTextarea,
  SendButton,
  EmptyState,
  LoadingSpinner,
} from "./styledComponents";

// ----------------- Utility Functions -------------------
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
  });
  return groups;
};

const getOtherParticipant = (chat, userId) => {
  if (!chat?.participants) return null;
  return chat.participants.find((p) => p._id !== userId);
};

const getLastMessage = (chat) => {
  if (!chat?.lastMessage) return "No messages yet";
  const content = chat.lastMessage.content || '';
  return content.length > 50 ? `${content.substring(0, 50)}...` : content;
};

// ----------------- Main Component -------------------
const Chat = ({
  chats = [],
  selectedChat = null,
  onChatSelect = null,
  compact = false,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(selectedChat);
  const messagesEndRef = useRef(null);

  const { user } = useAuth();
  const { socket, isConnected, joinChat, leaveChat } = useSocket();

  // ----------------- Socket Events -------------------
  useEffect(() => {
    if (!currentChat || !socket || !isConnected) return;

    // Join the chat room
    joinChat(currentChat._id);

    // Listen for new messages
    const handleNewMessage = (message) => {
      if (message.chat === currentChat._id) {
        setMessages((prev) => {
          // Prevent duplicates by checking _id or tempId
          const exists = prev.some((m) => {
            if (m._id && message._id) return m._id === message._id;
            if (m.tempId && message.tempId) return m.tempId === message.tempId;
            // Check by content + sender + approximate time (within 2 seconds)
            return (
              m.content === message.content &&
              (m.sender === message.sender || m.sender?._id === message.sender) &&
              Math.abs(new Date(m.timestamp) - new Date(message.timestamp)) < 2000
            );
          });
          
          if (exists) {
            // Replace optimistic message with real one
            return prev.map((m) => {
              if (m.tempId && message.content === m.content) {
                return message;
              }
              return m;
            });
          }
          
          return [...prev, message];
        });
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receiveMessage", handleNewMessage); // Backup event name

    // Cleanup
    return () => {
      leaveChat(currentChat._id);
      socket.off("newMessage", handleNewMessage);
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [currentChat, socket, isConnected, joinChat, leaveChat]);

  // ----------------- Scroll to latest -------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------- Load messages API -------------------
  const loadMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;
      
      setLoading(true);
      try {
        const response = await chatAPI.getMessages(chatId);
        // Ensure this response is still relevant
        if (chatId === currentChat?._id) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    },
    [currentChat?._id]
  );

  // Load messages when selectedChat changes
  useEffect(() => {
    if (selectedChat && selectedChat._id !== currentChat?._id) {
      setCurrentChat(selectedChat);
      loadMessages(selectedChat._id);
    }
  }, [selectedChat, currentChat?._id, loadMessages]);

  // ----------------- Select chat -------------------
  const handleChatSelect = (chat) => {
    if (chat._id === currentChat?._id) return;
    
    setCurrentChat(chat);
    setMessages([]);
    loadMessages(chat._id);
    
    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  // ----------------- Send Message -------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Optimistic message object
    const optimisticMessage = {
      tempId,
      content: messageText,
      sender: user._id,
      chat: currentChat._id,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      // Send via API - backend will broadcast via socket to all participants
      const response = await chatAPI.sendMessage(currentChat._id, {
        content: messageText,
      });

      // Replace optimistic message with real one
      if (response.data.message) {
        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === tempId ? response.data.message : m
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Mark message as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, failed: true, pending: false } : m
        )
      );
    }
  };

  // ----------------- Compact Mode -------------------
  if (compact) {
    return (
      <ChatContainer compact>
        <ChatList>
          {chats.length > 0 ? (
            chats.slice(0, 5).map((chat) => {
              const otherUser = getOtherParticipant(chat, user._id);
              if (!otherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  active={currentChat?._id === chat._id}
                >
                  <ChatAvatar>
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      <span>
                        {otherUser.firstName?.[0] || '?'}
                        {otherUser.lastName?.[0] || ''}
                      </span>
                    )}
                  </ChatAvatar>
                  <ChatInfo>
                    <ChatName>
                      {otherUser.firstName} {otherUser.lastName}
                    </ChatName>
                    <ChatLastMessage>{getLastMessage(chat)}</ChatLastMessage>
                  </ChatInfo>
                  {chat.unreadCount > 0 && (
                    <ChatBadge>{chat.unreadCount}</ChatBadge>
                  )}
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <p>No conversations</p>
            </EmptyState>
          )}
        </ChatList>
      </ChatContainer>
    );
  }

  // ----------------- Full Mode -------------------
  const otherUser = currentChat ? getOtherParticipant(currentChat, user._id) : null;

  return (
    <ChatContainer>
      {/* Sidebar */}
      <ChatSidebar>
        <div style={{ padding: "1rem", borderBottom: "1px solid #e2e8f0" }}>
          <h3
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#2d3748",
            }}
          >
            Messages
          </h3>
        </div>

        <ChatList>
          {chats.length > 0 ? (
            chats.map((chat) => {
              const chatOtherUser = getOtherParticipant(chat, user._id);
              if (!chatOtherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  active={currentChat?._id === chat._id}
                >
                  <ChatAvatar>
                    {chatOtherUser.avatar ? (
                      <img src={chatOtherUser.avatar} alt={chatOtherUser.firstName} />
                    ) : (
                      <span>
                        {chatOtherUser.firstName?.[0] || '?'}
                        {chatOtherUser.lastName?.[0] || ''}
                      </span>
                    )}
                  </ChatAvatar>
                  <ChatInfo>
                    <ChatName>
                      {chatOtherUser.firstName} {chatOtherUser.lastName}
                    </ChatName>
                    <ChatLastMessage>{getLastMessage(chat)}</ChatLastMessage>
                    {chat.lastMessage && (
                      <ChatTime>
                        {formatTime(chat.lastMessage.timestamp)}
                      </ChatTime>
                    )}
                  </ChatInfo>
                  {chat.unreadCount > 0 && (
                    <ChatBadge>{chat.unreadCount}</ChatBadge>
                  )}
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <p>No conversations yet</p>
            </EmptyState>
          )}
        </ChatList>
      </ChatSidebar>

      {/* Main Chat Area */}
      <ChatMain>
        {currentChat && otherUser ? (
          <>
            <ChatHeader>
              <ChatAvatar>
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.firstName} />
                ) : (
                  <span>
                    {otherUser.firstName?.[0] || '?'}
                    {otherUser.lastName?.[0] || ''}
                  </span>
                )}
              </ChatAvatar>
              <ChatHeaderInfo>
                <ChatHeaderName>
                  {otherUser.firstName} {otherUser.lastName}
                </ChatHeaderName>
                <ChatHeaderStatus>
                  {isConnected ? 'Online' : 'Offline'}
                </ChatHeaderStatus>
              </ChatHeaderInfo>
            </ChatHeader>

            {/* Messages */}
            <MessagesContainer>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "2rem",
                  }}
                >
                  <LoadingSpinner />
                </div>
              ) : messages.length === 0 ? (
                <EmptyState>
                  <p>No messages yet. Start the conversation!</p>
                </EmptyState>
              ) : (
                Object.entries(groupMessagesByDate(messages)).map(
                  ([date, dayMessages]) => (
                    <MessageGroup key={date}>
                      <div
                        style={{
                          textAlign: "center",
                          margin: "1rem 0",
                          color: "#64748b",
                          fontSize: "0.85rem",
                        }}
                      >
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>

                      {dayMessages.map((message, index) => {
                        const isOwn =
                          message.sender === user._id ||
                          message.sender?._id === user._id;

                        return (
                          <MessageBubble
                            key={message._id || message.tempId || index}
                            isOwn={isOwn}
                          >
                            <MessageContent isOwn={isOwn}>
                              {message.content}
                              {message.pending && !message.failed && (
                                <span style={{ marginLeft: 8, opacity: 0.6 }}>
                                  ⏳
                                </span>
                              )}
                              {message.failed && (
                                <span style={{ color: "#ef4444", marginLeft: 8 }}>
                                  ✗ Failed
                                </span>
                              )}
                            </MessageContent>
                            <MessageTime>
                              {formatTime(message.timestamp)}
                            </MessageTime>
                          </MessageBubble>
                        );
                      })}
                    </MessageGroup>
                  )
                )
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            {/* Input */}
            <InputContainer>
              <form onSubmit={handleSendMessage} style={{ width: '100%' }}>
                <MessageInput>
                  <MessageTextarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={!isConnected}
                  />
                  <SendButton 
                    type="submit" 
                    disabled={!newMessage.trim() || !isConnected}
                    title={!isConnected ? "Disconnected from chat server" : "Send message"}
                  >
                    📤
                  </SendButton>
                </MessageInput>
              </form>
            </InputContainer>
          </>
        ) : (
          <EmptyState>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start chatting</p>
          </EmptyState>
        )}
      </ChatMain>
    </ChatContainer>
  );
};

export default Chat;