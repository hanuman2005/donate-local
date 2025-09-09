// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { useAuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthContext();

  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token");
      const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current = newSocket;

      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      newSocket.on("userOnline", (data) => {
        setOnlineUsers((prev) => [
          ...prev.filter((u) => u.userId !== data.userId),
          data,
        ]);
      });

      newSocket.on("userOffline", (data) => {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      });

      newSocket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        toast.info(notification.message);
      });

      newSocket.on("error", (error) =>
        toast.error(error?.message || error || "Socket error")
      );

      return () => {
        newSocket.off("userOnline");
        newSocket.off("userOffline");
        newSocket.off("newNotification");
        newSocket.off("error");
        newSocket.close();
      };
    } else {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setIsConnected(false);
        setOnlineUsers([]);
        setNotifications([]);
      }
    }
  }, [user]);

  // Emitters
  const joinChat = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit("joinChat", chatId);
    }
  };

  const leaveChat = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit("leaveChat", chatId);
    }
  };

  const sendMessage = (data) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", data);
    }
  };

  const markAsRead = (chatId) => {
    if (socketRef.current) {
      socketRef.current.emit("markAsRead", { chatId });
    }
  };

  const emitTyping = (chatId, isTyping) => {
    if (socketRef.current) {
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
