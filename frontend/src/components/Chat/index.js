// ============================================
// src/components/Chat/index.js - FIXED MESSAGE DISPLAY
// ============================================
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { chatAPI } from "../../services/api";
import { motionVariants } from "../../animations/motionVariants";

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

const deduplicateChats = (chats) => {
  const seen = new Set();
  return chats.filter((chat) => {
    if (seen.has(chat._id)) {
      return false;
    }
    seen.add(chat._id);
    return true;
  });
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
  const [allChats, setAllChats] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!compact && chats.length === 0) {
      fetchChats();
    } else {
      const uniqueChats = deduplicateChats(chats);
      setAllChats(uniqueChats);
    }
  }, [compact, chats]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getUserChats();
      const fetchedChats = response.data.chats || response.data.data || [];
      const uniqueChats = deduplicateChats(fetchedChats);
      setAllChats(uniqueChats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    if (chatId && allChats.length > 0) {
      const chat = allChats.find((c) => c._id === chatId);
      if (chat && (!currentChat || currentChat._id !== chatId)) {
        setCurrentChat(chat);
        loadMessages(chatId);
        setShowSidebar(false);
      }
    }
  }, [chatId, allChats, currentChat]);

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    if (!currentChat || !socket || !isConnected) return;

    console.log("🔌 Joining chat:", currentChat._id);
    socket.emit("joinChat", currentChat._id);

    const handleNewMessage = (message) => {
      console.log("📩 Received message:", message);

      if (
        message.chat === currentChat._id ||
        message.chat?._id === currentChat._id
      ) {
        setMessages((prev) => {
          // ✅ FIXED: Improved duplicate prevention
          const exists = prev.some((m) => {
            // Check by actual message ID first
            if (m._id && message._id && m._id === message._id) return true;

            // Don't check temp messages here - they're replaced by handleSendMessage
            if (m.tempId || m.pending) return false;

            // Check for duplicates based on content and time
            const isSameSender =
              m.sender === message.sender ||
              m.sender?._id === message.sender ||
              m.sender?._id === message.sender?._id;
            const isSameContent = m.content === message.content;
            const timeDiff = Math.abs(
              new Date(m.timestamp) - new Date(message.timestamp)
            );

            return isSameSender && isSameContent && timeDiff < 1000;
          });

          if (exists) {
            console.log("⚠️ Duplicate message prevented");
            return prev;
          }

          console.log("✅ Adding new message");
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
    socket.on("userTyping", handleTyping);

    return () => {
      console.log("🧹 Leaving chat:", currentChat._id);
      socket.emit("leaveChat", currentChat._id);
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleTyping);
    };
  }, [currentChat, socket, isConnected, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleTyping = () => {
    if (socket && currentChat) {
      socket.emit("typing", {
        chatId: currentChat._id,
        userId: user._id,
      });
    }
  };

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

      const serverMessage = response.data.message || response.data;

      // ✅ FIXED: Replace temp message with server message immediately
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...serverMessage, _id: serverMessage._id } : m
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId ? { ...m, failed: true, pending: false } : m
        )
      );
    }
  };

  const chatsToDisplay = compact ? chats : allChats;
  const uniqueChatsToDisplay = deduplicateChats(chatsToDisplay);

  const filteredChats = uniqueChatsToDisplay.filter((chat) => {
    if (!searchQuery) return true;
    const otherUser = getOtherParticipant(chat, user._id);
    if (!otherUser) return false;
    const name = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  if (compact) {
    return (
      <ChatContainer $compact>
        <ChatList
          as={motion.div}
          variants={motionVariants.staggerContainerFast}
          initial="hidden"
          animate="show"
        >
          {uniqueChatsToDisplay.length > 0 ? (
            uniqueChatsToDisplay.slice(0, 5).map((chat) => {
              const otherUser = getOtherParticipant(chat, user._id);
              if (!otherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  as={motion.div}
                  variants={motionVariants.listItemSlideUp}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/chat/${chat._id}`)}
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
                    <UnreadBadge
                      as={motion.div}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      $active={currentChat?._id === chat._id}
                    >
                      {chat.unreadCount}
                    </UnreadBadge>
                  )}
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyIcon
                as={motion.div}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💬
              </EmptyIcon>
              <EmptyText>No conversations</EmptyText>
            </EmptyState>
          )}
        </ChatList>
      </ChatContainer>
    );
  }

  const otherUser = currentChat
    ? getOtherParticipant(currentChat, user._id)
    : null;

  return (
    <ChatContainer
      as={motion.div}
      variants={motionVariants.fadeSlide}
      initial="hidden"
      animate="show"
    >
      <Sidebar
        as={motion.div}
        $hidden={!showSidebar}
        initial={{ x: showSidebar ? 0 : -350 }}
        animate={{ x: showSidebar ? 0 : -350 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarHeader>
          <SidebarTitle>💬 Messages</SidebarTitle>
          <SearchInput
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SidebarHeader>

        <ChatList
          as={motion.div}
          variants={motionVariants.staggerContainerFast}
          initial="hidden"
          animate="show"
        >
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const chatOtherUser = getOtherParticipant(chat, user._id);
              if (!chatOtherUser) return null;

              return (
                <ChatItem
                  key={chat._id}
                  as={motion.div}
                  variants={motionVariants.listItemSlideUp}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
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
                    {isConnected && (
                      <OnlineIndicator
                        as={motion.div}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
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
                      <UnreadBadge
                        as={motion.div}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        $active={currentChat?._id === chat._id}
                      >
                        {chat.unreadCount}
                      </UnreadBadge>
                    )}
                  </ChatMeta>
                </ChatItem>
              );
            })
          ) : (
            <EmptyState>
              <EmptyIcon
                as={motion.div}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🔍
              </EmptyIcon>
              <EmptyText>
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </EmptyText>
            </EmptyState>
          )}
        </ChatList>
      </Sidebar>

      <MainChat
        as={motion.div}
        $hidden={showSidebar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {currentChat && otherUser ? (
          <>
            <ChatHeader as={motion.div} initial={{ y: -50 }} animate={{ y: 0 }}>
              <BackButton
                as={motion.button}
                onClick={() => setShowSidebar(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </BackButton>
              <Avatar as={motion.div} whileHover={{ scale: 1.05 }}>
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
                  <EmptyIcon
                    as={motion.div}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💬
                  </EmptyIcon>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyText>Start the conversation!</EmptyText>
                </EmptyState>
              ) : (
                Object.entries(groupMessagesByDate(messages)).map(
                  ([date, dayMessages]) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <DateDivider>
                        <span>{formatDate(new Date(date))}</span>
                      </DateDivider>

                      <AnimatePresence>
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
                              as={motion.div}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              $isOwn={isOwn}
                            >
                              {!isOwn && showAvatar && (
                                <MessageAvatar
                                  as={motion.div}
                                  whileHover={{ scale: 1.1 }}
                                >
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
                                  as={motion.div}
                                  whileHover={{ scale: 1.02 }}
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
                      </AnimatePresence>
                    </motion.div>
                  )
                )
              )}
              <div ref={messagesEndRef} />
            </MessagesArea>

            <InputArea as={motion.div} initial={{ y: 50 }} animate={{ y: 0 }}>
              <InputForm onSubmit={handleSendMessage}>
                <InputWrapper>
                  <IconButton
                    as={motion.button}
                    type="button"
                    title="Attach file"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
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
                  <IconButton
                    as={motion.button}
                    type="button"
                    title="Add emoji"
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    😊
                  </IconButton>
                </InputWrapper>
                <SendButton
                  as={motion.button}
                  type="submit"
                  disabled={!newMessage.trim() || !isConnected}
                  title={!isConnected ? "Disconnected" : "Send message"}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isConnected ? "📤" : "⚠️"}
                </SendButton>
              </InputForm>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            <EmptyIcon
              as={motion.div}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              💬
            </EmptyIcon>
            <EmptyTitle>Select a conversation</EmptyTitle>
            <EmptyText>Choose from the sidebar to start chatting</EmptyText>
          </EmptyState>
        )}
      </MainChat>
    </ChatContainer>
  );
};

export default Chat;
