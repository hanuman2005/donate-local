// ============================================
// src/pages/Notifications/index.jsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import {
  NotificationsContainer,
  NotificationsCard,
  Header,
  HeaderTop,
  Title,
  UnreadBadge,
  MarkAllButton,
  FilterContainer,
  FilterButton,
  NotificationsList,
  NotificationItem,
  NotificationIcon,
  NotificationContent,
  NotificationHeader,
  NotificationTitle,
  NotificationTime,
  NotificationMessage,
  NotificationSender,
  SenderAvatar,
  SenderName,
  EmptyState,
  EmptyStateIcon,
  EmptyStateText,
} from './styledComponents';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('newNotification');
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === 'unread' ? { unreadOnly: true } : {};
      
      const response = await api.get('/notifications', { params });
      
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      message: '💬',
      interest: '👋',
      assignment: '✅',
      rating: '⭐',
      completion: '🎉',
      system: '📢'
    };
    return icons[type] || '🔔';
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <NotificationsContainer>
      <NotificationsCard>
        <Header>
          <HeaderTop>
            <Title>
              Notifications
              {unreadCount > 0 && (
                <UnreadBadge>{unreadCount}</UnreadBadge>
              )}
            </Title>
            
            {unreadCount > 0 && (
              <MarkAllButton onClick={markAllAsRead}>
                Mark all as read
              </MarkAllButton>
            )}
          </HeaderTop>

          <FilterContainer>
            <FilterButton
              $active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton
              $active={filter === 'unread'}
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </FilterButton>
          </FilterContainer>
        </Header>

        <NotificationsList>
          {notifications.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>🔔</EmptyStateIcon>
              <EmptyStateText>
                {filter === 'unread' 
                  ? "No unread notifications"
                  : "No notifications yet"}
              </EmptyStateText>
              <p style={{ color: '#a0aec0', margin: 0 }}>
                You're all caught up!
              </p>
            </EmptyState>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif._id}
                $read={notif.read}
                onClick={() => handleNotificationClick(notif)}
              >
                <NotificationIcon>
                  {getNotificationIcon(notif.type)}
                </NotificationIcon>
                
                <NotificationContent>
                  <NotificationHeader>
                    <NotificationTitle>
                      {notif.title}
                    </NotificationTitle>
                    <NotificationTime>
                      {formatTime(notif.createdAt)}
                    </NotificationTime>
                  </NotificationHeader>
                  
                  <NotificationMessage>
                    {notif.message}
                  </NotificationMessage>
                  
                  {notif.sender && (
                    <NotificationSender>
                      <SenderAvatar>
                        {notif.sender.avatar ? (
                          <img src={notif.sender.avatar} alt={notif.sender.firstName} />
                        ) : (
                          <span>
                            {notif.sender.firstName?.[0]}
                            {notif.sender.lastName?.[0]}
                          </span>
                        )}
                      </SenderAvatar>
                      <SenderName>
                        {notif.sender.firstName} {notif.sender.lastName}
                      </SenderName>
                    </NotificationSender>
                  )}
                </NotificationContent>
              </NotificationItem>
            ))
          )}
        </NotificationsList>
      </NotificationsCard>
    </NotificationsContainer>
  );
};

export default Notifications;