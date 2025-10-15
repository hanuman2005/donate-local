import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Maximum number of notifications to keep in memory
const MAX_NOTIFICATIONS = 50;

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      
      // Get socket URL with fallback
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      
      if (!process.env.REACT_APP_SOCKET_URL) {
        console.warn('REACT_APP_SOCKET_URL not set, using default: http://localhost:5000');
      }

      const newSocket = io(socketUrl, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("✅ Connected to socket server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Unable to connect to chat server");
      });

      newSocket.on("userOnline", (data) => {
        setOnlineUsers((prev) => {
          // Remove duplicate and add updated user
          const filtered = prev.filter((u) => u.userId !== data.userId);
          return [...filtered, data];
        });
      });

      newSocket.on("userOffline", (data) => {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      });

      newSocket.on("newNotification", (notification) => {
        setNotifications((prev) => {
          // Add new notification and limit array size
          const updated = [notification, ...prev];
          return updated.slice(0, MAX_NOTIFICATIONS);
        });
        toast.info(notification.message);
      });

      newSocket.on("error", (error) => {
        const message = error?.message || error || "Socket error occurred";
        console.error("Socket error:", message);
        toast.error(message);
      });

      // Cleanup function
      return () => {
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.off("userOnline");
        newSocket.off("userOffline");
        newSocket.off("newNotification");
        newSocket.off("error");
        newSocket.close();
      };
    } else {
      // User logged out - cleanup socket
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
        setOnlineUsers([]);
        setNotifications([]);
      }
    }
  }, [user]);

  // Socket emitters with error handling
  const joinChat = (chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("joinChat", chatId);
    } else {
      console.warn("Cannot join chat: Socket not connected");
    }
  };

  const leaveChat = (chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leaveChat", chatId);
    } else {
      console.warn("Cannot leave chat: Socket not connected");
    }
  };

  const sendMessage = (data, callback) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("sendMessage", data, (response) => {
        if (response?.error) {
          toast.error("Failed to send message");
          console.error("Message send error:", response.error);
        }
        callback?.(response);
      });
    } else {
      toast.error("Not connected to chat server");
      callback?.({ error: "Not connected" });
    }
  };

  const markAsRead = (chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("markAsRead", { chatId });
    } else {
      console.warn("Cannot mark as read: Socket not connected");
    }
  };

  const emitTyping = (chatId, isTyping) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("typing", { chatId, isTyping });
    }
  };

  const clearNotifications = () => setNotifications([]);

  const value = {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    notifications,
    joinChat,
    leaveChat,
    sendMessage,
    markAsRead,
    emitTyping,
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};