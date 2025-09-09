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
const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
  if (!chat.participants) return null;
  return chat.participants.find((p) => p._id !== userId);
};

const getLastMessage = (chat) => {
  if (!chat.lastMessage) return "No messages yet";
  return chat.lastMessage.content.length > 50
    ? `${chat.lastMessage.content.substring(0, 50)}...`
    : chat.lastMessage.content;
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
  const { socket, joinChat, leaveChat, sendMessage, onMessage, offMessage } =
    useSocket();

  // ----------------- Socket Events -------------------
  useEffect(() => {
    if (!currentChat || !socket) return;

    joinChat(currentChat._id);

    const handleIncomingMessage = (message) => {
      if (message.chat === currentChat._id) {
        setMessages((prev) => {
          // prevent duplicates (match by content & sender & timestamp or ID)
          const exists = prev.some(
            (m) =>
              (m._id && message._id && m._id === message._id) ||
              (m.tempId && message.tempId && m.tempId === message.tempId)
          );
          return exists ? prev : [...prev, message];
        });
      }
    };

    onMessage(handleIncomingMessage);

    return () => {
      leaveChat(currentChat._id);
      offMessage(handleIncomingMessage);
    };
  }, [currentChat, socket, joinChat, leaveChat, onMessage, offMessage]);

  // ----------------- Scroll to latest -------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------- Load messages API -------------------
  const loadMessages = useCallback(
    async (chatId) => {
      setLoading(true);
      try {
        const response = await chatAPI.getMessages(chatId);
        // Ensure this response is still relevant
        if (chatId === currentChat?._id) {
          setMessages(response.data.messages || []);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentChat?._id]
  );

  useEffect(() => {
    if (selectedChat && selectedChat !== currentChat) {
      setCurrentChat(selectedChat);
      loadMessages(selectedChat._id);
    }
  }, [selectedChat, currentChat, loadMessages]);

  // ----------------- Select chat -------------------
  const handleChatSelect = (chat) => {
    setCurrentChat(chat);
    loadMessages(chat._id);
    if (onChatSelect) onChatSelect(chat);
  };

  // ----------------- Send Message -------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const messageText = newMessage.trim();

    // optimistic message object
    const optimisticMessage = {
      tempId: "temp-" + Date.now(),
      content: messageText,
      sender: user._id,
      chat: currentChat._id,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      await chatAPI.sendMessage(currentChat._id, messageText);
      // Also send through socket
      sendMessage(currentChat._id, optimisticMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      // mark message as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === optimisticMessage.tempId ? { ...m, failed: true } : m
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
              return (
                <ChatItem
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  active={currentChat?._id === chat._id}
                >
                  <ChatAvatar>
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      <span>
                        {otherUser?.firstName?.[0]}
                        {otherUser?.lastName?.[0]}
                      </span>
                    )}
                  </ChatAvatar>
                  <ChatInfo>
                    <ChatName>
                      {otherUser?.firstName} {otherUser?.lastName}
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
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat, user._id);
            return (
              <ChatItem
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                active={currentChat?._id === chat._id}
              >
                <ChatAvatar>
                  {otherUser?.avatar ? (
                    <img src={otherUser.avatar} alt={otherUser.firstName} />
                  ) : (
                    <span>
                      {otherUser?.firstName?.[0]}
                      {otherUser?.lastName?.[0]}
                    </span>
                  )}
                </ChatAvatar>
                <ChatInfo>
                  <ChatName>
                    {otherUser?.firstName} {otherUser?.lastName}
                  </ChatName>
                  <ChatLastMessage>{getLastMessage(chat)}</ChatLastMessage>
                  <ChatTime>
                    {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                  </ChatTime>
                </ChatInfo>
                {chat.unreadCount > 0 && (
                  <ChatBadge>{chat.unreadCount}</ChatBadge>
                )}
              </ChatItem>
            );
          })}
        </ChatList>
      </ChatSidebar>

      {/* Main Chat Area */}
      <ChatMain>
        {currentChat ? (
          <>
            <ChatHeader>
              <ChatAvatar>
                {getOtherParticipant(currentChat, user._id)?.avatar ? (
                  <img
                    src={getOtherParticipant(currentChat, user._id).avatar}
                    alt="User"
                  />
                ) : (
                  <span>
                    {getOtherParticipant(currentChat, user._id)?.firstName?.[0]}
                    {getOtherParticipant(currentChat, user._id)?.lastName?.[0]}
                  </span>
                )}
              </ChatAvatar>
              <ChatHeaderInfo>
                <ChatHeaderName>
                  {getOtherParticipant(currentChat, user._id)?.firstName}{" "}
                  {getOtherParticipant(currentChat, user._id)?.lastName}
                </ChatHeaderName>
                <ChatHeaderStatus>Online</ChatHeaderStatus>
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

                      {dayMessages.map((message, index) => (
                        <MessageBubble
                          key={message._id || message.tempId || index}
                          isOwn={
                            message.sender === user._id ||
                            message.sender._id === user._id
                          }
                        >
                          <MessageContent>
                            {message.content}
                            {message.failed && (
                              <span style={{ color: "red", marginLeft: 8 }}>
                                (failed)
                              </span>
                            )}
                          </MessageContent>
                          <MessageTime>
                            {formatTime(message.timestamp)}
                          </MessageTime>
                        </MessageBubble>
                      ))}
                    </MessageGroup>
                  )
                )
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            {/* Input */}
            <InputContainer>
              <form onSubmit={handleSendMessage}>
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
                  />
                  <SendButton type="submit" disabled={!newMessage.trim()}>
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
