import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { chatAPI } from "../../services/api";

import {
  ChatContainer,
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  SearchInput,
  ChatList,
  ChatItem,
  Avatar,
  ChatInfo,
  ChatName,
  LastMessage,
  UnreadBadge,
  OnlineIndicator,
  MainChat,
  ChatHeader,
  BackButton,
  HeaderInfo,
  HeaderName,
  HeaderStatus,
  TypingIndicator,
  MessagesArea,
  DateDivider,
  MessageBubble,
  MessageAvatar,
  MessageContent,
  MessageText,
  MessageTime,
  InputArea,
  InputForm,
  InputWrapper,
  IconButton,
  MessageInput,
  SendButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  ChatMeta,
  TimeStamp,
  LoadingSpinner,
} from "./styledComponents";

// ==================== UTILITY FUNCTIONS ====================

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
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
  const content = chat.lastMessage.content || "";
  return content.length > 40 ? `${content.substring(0, 40)}...` : content;
};

// ==================== MAIN COMPONENT ====================

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [allChats, setAllChats] = useState(chats);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { user } = useAuth();
  const { socket, isConnected, joinChat, leaveChat } = useSocket();

  // ==================== FETCH CHATS ====================
  
  useEffect(() => {
    if (!compact && chats.length === 0) {
      fetchChats();
    } else {
      setAllChats(chats);
    }
  }, [compact, chats]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getUserChats();
      const fetchedChats = response.data.chats || response.data.data || [];
      setAllChats(fetchedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // ==================== LOAD CHAT FROM URL ====================

  useEffect(() => {
    if (chatId && allChats.length > 0) {
      const chat = allChats.find(c => c._id === chatId);
      if (chat && (!currentChat || currentChat._id !== chatId)) {
        setCurrentChat(chat);
        loadMessages(chatId);
        setShowSidebar(false);
      }
    }
  }, [chatId, allChats, currentChat]);

  // ==================== AUTO-ADJUST TEXTAREA ====================

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  // ==================== SOCKET EVENTS ====================

  useEffect(() => {
    if (!currentChat || !socket || !isConnected) return;

    joinChat(currentChat._id);

    const handleNewMessage = (message) => {
      if (message.chat === currentChat._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => {
            if (m._id && message._id) return m._id === message._id;
            if (m.tempId && message.tempId) return m.tempId === message.tempId;
            return (
              m.content === message.content &&
              (m.sender === message.sender || m.sender?._id === message.sender) &&
              Math.abs(new Date(m.timestamp) - new Date(message.timestamp)) < 2000
            );
          });

          if (exists) {
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

    const handleTyping = (data) => {
      if (data.chatId === currentChat._id && data.userId !== user._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("receiveMessage", handleNewMessage);
    socket.on("userTyping", handleTyping);

    return () => {
      leaveChat(currentChat._id);
      socket.off("newMessage", handleNewMessage);
      socket.off("receiveMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
    };
  }, [currentChat, socket, isConnected, joinChat, leaveChat, user]);

  // ==================== SCROLL TO BOTTOM ====================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ==================== LOAD MESSAGES ====================

  const loadMessages = useCallback(
    async (chatId) => {
      if (!chatId) return;

      setLoading(true);
      try {
        const response = await chatAPI.getMessages(chatId);
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

  useEffect(() => {
    if (selectedChat && selectedChat._id !== currentChat?._id) {
      setCurrentChat(selectedChat);
      loadMessages(selectedChat._id);
      setShowSidebar(false);
    }
  }, [selectedChat, currentChat?._id, loadMessages]);

  // ==================== HANDLE CHAT SELECTION ====================

  const handleChatSelect = (chat) => {
    if (chat._id === currentChat?._id) return;

    setCurrentChat(chat);
    setMessages([]);
    loadMessages(chat._id);
    setShowSidebar(false);

    if (onChatSelect) {
      onChatSelect(chat);
    }
  };

  // ==================== HANDLE TYPING ====================

  const handleTyping = () => {
    if (socket && currentChat) {
      socket.emit("typing", {
        chatId: currentChat._id,
        userId: user._id,
      });
    }
  };

  // ==================== SEND MESSAGE ====================

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const optimisticMessage = {
      tempId,
      content: messageText,
      sender: user._id,
      chat: currentChat._id,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await chatAPI.sendMessage(currentChat._id, {
        content: messageText,
      });

      if (response.data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.tempId === tempId ? response.data.message : m))
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, failed: true, pending: false } : m
        )
      );
    }
  };

  // ==================== FILTER CHATS ====================

  const chatsToDisplay = compact ? chats : allChats;
  const filteredChats = chatsToDisplay.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = getOtherParticipant(chat, user._id);
    if (!otherUser) return false;
    const name = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  // ==================== COMPACT MODE ====================

  if (compact) {
    return (
      <ChatContainer $compact>
        <ChatList>
          {chats.length > 0 ? (
            chats.slice(0, 5).map((chat) => {
              const otherUser = getOtherParticipant(chat, user._id);
              if (!otherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  onClick={() => {
                    console.log("🔍 Chat clicked:", chat);
                    navigate(`/chat/${chat._id}`);
                  }}
                  $active={currentChat?._id === chat._id}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar $active={currentChat?._id === chat._id}>
                    {otherUser.avatar ? (
                      <img src={otherUser.avatar} alt={otherUser.firstName} />
                    ) : (
                      <span>
                        {otherUser.firstName?.[0] || "?"}
                        {otherUser.lastName?.[0] || ""}
                      </span>
                    )}
                  </Avatar>
                  <ChatInfo>
                    <ChatName>
                      {otherUser.firstName} {otherUser.lastName}
                    </ChatName>
                    <LastMessage $active={currentChat?._id === chat._id}>
                      {getLastMessage(chat)}
                    </LastMessage>
                  </ChatInfo>
                  {chat.unreadCount > 0 && (
                    <UnreadBadge $active={currentChat?._id === chat._id}>
                      {chat.unreadCount}
                    </UnreadBadge>
                  )}
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyIcon>💬</EmptyIcon>
              <EmptyText>No conversations</EmptyText>
            </EmptyState>
          )}
        </ChatList>
      </ChatContainer>
    );
  }

  // ==================== FULL MODE ====================

  const otherUser = currentChat ? getOtherParticipant(currentChat, user._id) : null;

  return (
    <ChatContainer>
      {/* ==================== SIDEBAR ==================== */}
      <Sidebar $hidden={!showSidebar}>
        <SidebarHeader>
          <SidebarTitle>💬 Messages</SidebarTitle>
          <SearchInput
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SidebarHeader>

        <ChatList>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const chatOtherUser = getOtherParticipant(chat, user._id);
              if (!chatOtherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  $active={currentChat?._id === chat._id}
                >
                  <Avatar $active={currentChat?._id === chat._id}>
                    {chatOtherUser.avatar ? (
                      <img
                        src={chatOtherUser.avatar}
                        alt={chatOtherUser.firstName}
                      />
                    ) : (
                      <span>
                        {chatOtherUser.firstName?.[0] || "?"}
                        {chatOtherUser.lastName?.[0] || ""}
                      </span>
                    )}
                    {isConnected && <OnlineIndicator />}
                  </Avatar>
                  <ChatInfo>
                    <ChatName>
                      {chatOtherUser.firstName} {chatOtherUser.lastName}
                    </ChatName>
                    <LastMessage $active={currentChat?._id === chat._id}>
                      {getLastMessage(chat)}
                    </LastMessage>
                  </ChatInfo>
                  <ChatMeta>
                    {chat.lastMessage && (
                      <TimeStamp>
                        {formatTime(chat.lastMessage.timestamp)}
                      </TimeStamp>
                    )}
                    {chat.unreadCount > 0 && (
                      <UnreadBadge $active={currentChat?._id === chat._id}>
                        {chat.unreadCount}
                      </UnreadBadge>
                    )}
                  </ChatMeta>
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyText>
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </EmptyText>
            </EmptyState>
          )}
        </ChatList>
      </Sidebar>

      {/* ==================== MAIN CHAT ==================== */}
      <MainChat $hidden={showSidebar}>
        {currentChat && otherUser ? (
          <>
            {/* ==================== CHAT HEADER ==================== */}
            <ChatHeader>
              <BackButton onClick={() => setShowSidebar(true)}>←</BackButton>
              <Avatar>
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.firstName} />
                ) : (
                  <span>
                    {otherUser.firstName?.[0] || "?"}
                    {otherUser.lastName?.[0] || ""}
                  </span>
                )}
              </Avatar>
              <HeaderInfo>
                <HeaderName>
                  {otherUser.firstName} {otherUser.lastName}
                </HeaderName>
                {isTyping ? (
                  <TypingIndicator>typing...</TypingIndicator>
                ) : (
                  <HeaderStatus $online={isConnected}>
                    {isConnected ? "Online" : "Offline"}
                  </HeaderStatus>
                )}
              </HeaderInfo>
            </ChatHeader>

            {/* ==================== MESSAGES AREA ==================== */}
            <MessagesArea>
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
                  <EmptyIcon>💬</EmptyIcon>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyText>Start the conversation!</EmptyText>
                  <div
                    style={{
                      marginTop: "2rem",
                      padding: "1rem",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: "12px",
                      color: "white",
                      maxWidth: "400px",
                      margin: "2rem auto 0",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>
                      💡 <strong>Tip:</strong> Type your message in the box below and
                      press Enter or click 📤 to send
                    </p>
                  </div>
                </EmptyState>
              ) : (
                Object.entries(groupMessagesByDate(messages)).map(
                  ([date, dayMessages]) => (
                    <div key={date}>
                      <DateDivider>
                        <span>{formatDate(new Date(date))}</span>
                      </DateDivider>

                      {dayMessages.map((message, index) => {
                        const isOwn =
                          message.sender === user._id ||
                          message.sender?._id === user._id;

                        const showAvatar =
                          index === 0 ||
                          dayMessages[index - 1]?.sender !== message.sender;

                        return (
                          <MessageBubble
                            key={message._id || message.tempId || index}
                            $isOwn={isOwn}
                          >
                            {!isOwn && showAvatar && (
                              <MessageAvatar>
                                {otherUser.avatar ? (
                                  <img
                                    src={otherUser.avatar}
                                    alt={otherUser.firstName}
                                  />
                                ) : (
                                  <span>
                                    {otherUser.firstName?.[0]}
                                    {otherUser.lastName?.[0]}
                                  </span>
                                )}
                              </MessageAvatar>
                            )}
                            {!isOwn && !showAvatar && (
                              <div style={{ width: "35px" }} />
                            )}
                            <MessageContent $isOwn={isOwn}>
                              <MessageText
                                $isOwn={isOwn}
                                $pending={message.pending}
                                $failed={message.failed}
                              >
                                {message.content}
                              </MessageText>
                              <MessageTime>
                                {formatTime(message.timestamp)}
                              </MessageTime>
                            </MessageContent>
                          </MessageBubble>
                        );
                      })}
                    </div>
                  )
                )
              )}
              <div ref={messagesEndRef} />
            </MessagesArea>

            {/* ==================== INPUT AREA ==================== */}
            <InputArea>
              <InputForm onSubmit={handleSendMessage}>
                <InputWrapper>
                  <IconButton type="button" title="Attach file">
                    📎
                  </IconButton>
                  <MessageInput
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      adjustTextareaHeight();
                      handleTyping();
                    }}
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
                  <IconButton type="button" title="Add emoji">
                    😊
                  </IconButton>
                </InputWrapper>
                <SendButton
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  title={!isConnected ? "Disconnected" : "Send message"}
                >
                  {isConnected ? "📤" : "⚠️"}
                </SendButton>
              </InputForm>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Select a conversation</EmptyTitle>
            <EmptyText>Choose from the sidebar to start chatting</EmptyText>
          </EmptyState>
        )}
      </MainChat>
    </ChatContainer>
  );
};

export default Chat;