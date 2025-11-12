// src/context/NotificationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Fetch unread count on mount
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification) => {
      console.log('🔔 New notification received:', notification);
      
      // Add to recent notifications
      setRecentNotifications(prev => [notification, ...prev].slice(0, 5));
      
      // Increment unread count
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.info(`${notification.icon} ${notification.title}`, {
        onClick: () => {
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
        },
        autoClose: 5000
      });
    };

    const handleNewListingAlert = (data) => {
      console.log('🎁 New listing alert:', data);
      
      toast.success(`🎁 ${data.donor.name} donated ${data.listing.title}!`, {
        onClick: () => {
          window.location.href = `/listings/${data.listing._id}`;
        },
        autoClose: 8000
      });
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('newListingAlert', handleNewListingAlert);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('newListingAlert', handleNewListingAlert);
    };
  }, [socket, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const value = {
    unreadCount,
    recentNotifications,
    fetchUnreadCount,
    markAllAsRead,
    setUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;