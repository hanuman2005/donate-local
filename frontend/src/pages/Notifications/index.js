import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';
import {
  NotificationsContainer,
  Header, 
  HeaderTop,
  Title,
  UnreadBadge,  
  MarkAllButton,
  FilterContainer,
  FilterButton, 
  NotificationsList,
  NotificationCard,
  NotificationIcon,
  NotificationContent,
  NotificationHeader,
  NotificationTitle,
  NotificationTime,
  NotificationMessage,
  NotificationActions,
  ActionButton,
  DateGroup,
  DateLabel,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
  LoadingContainer,
  Spinner
} from './styledComponents';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { socket } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

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
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
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
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return notifDate.toLocaleDateString();
  };

  const groupByDate = (notifs) => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    notifs.forEach(notif => {
      const date = new Date(notif.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - date) / 86400000);

      if (diffDays === 0) groups.today.push(notif);
      else if (diffDays === 1) groups.yesterday.push(notif);
      else if (diffDays < 7) groups.thisWeek.push(notif);
      else groups.older.push(notif);
    });

    return groups;
  };

  if (loading) {
    return (
      <NotificationsContainer>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </NotificationsContainer>
    );
  }

  const groupedNotifications = groupByDate(notifications);

  return (
    <NotificationsContainer>
      <Header>
        <HeaderTop>
          <Title>
            🔔 Notifications
            {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
          </Title>
          
          {unreadCount > 0 && (
            <MarkAllButton onClick={markAllAsRead}>
              ✓ Mark all as read
            </MarkAllButton>
          )}
        </HeaderTop>

        <FilterContainer>
          <FilterButton
            $active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All Notifications
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
            <EmptyIcon>🔔</EmptyIcon>
            <EmptyText>
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </EmptyText>
            <EmptySubtext>
              {filter === 'unread' 
                ? 'You have no unread notifications' 
                : "We'll notify you when something important happens"}
            </EmptySubtext>
          </EmptyState>
        ) : (
          <>
            {groupedNotifications.today.length > 0 && (
              <DateGroup>
                <DateLabel>📅 Today</DateLabel>
                {groupedNotifications.today.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    $read={notif.read}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <NotificationIcon type={notif.type}>
                      {getNotificationIcon(notif.type)}
                    </NotificationIcon>
                    
                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle>{notif.title}</NotificationTitle>
                        <NotificationTime>{formatTime(notif.createdAt)}</NotificationTime>
                      </NotificationHeader>
                      
                      <NotificationMessage>{notif.message}</NotificationMessage>
                      
                      <NotificationActions>
                        {notif.actionUrl && (
                          <ActionButton $primary onClick={() => navigate(notif.actionUrl)}>
                            View Details
                          </ActionButton>
                        )}
                        {!notif.read && (
                          <ActionButton onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif._id);
                          }}>
                            Mark as Read
                          </ActionButton>
                        )}
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}>
                          Delete
                        </ActionButton>
                      </NotificationActions>
                    </NotificationContent>
                  </NotificationCard>
                ))}
              </DateGroup>
            )}

            {groupedNotifications.yesterday.length > 0 && (
              <DateGroup>
                <DateLabel>📅 Yesterday</DateLabel>
                {groupedNotifications.yesterday.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    $read={notif.read}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <NotificationIcon type={notif.type}>
                      {getNotificationIcon(notif.type)}
                    </NotificationIcon>
                    
                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle>{notif.title}</NotificationTitle>
                        <NotificationTime>{formatTime(notif.createdAt)}</NotificationTime>
                      </NotificationHeader>
                      
                      <NotificationMessage>{notif.message}</NotificationMessage>
                      
                      <NotificationActions>
                        {notif.actionUrl && (
                          <ActionButton $primary onClick={() => navigate(notif.actionUrl)}>
                            View Details
                          </ActionButton>
                        )}
                        {!notif.read && (
                          <ActionButton onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif._id);
                          }}>
                            Mark as Read
                          </ActionButton>
                        )}
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}>
                          Delete
                        </ActionButton>
                      </NotificationActions>
                    </NotificationContent>
                  </NotificationCard>
                ))}
              </DateGroup>
            )}

            {groupedNotifications.thisWeek.length > 0 && (
              <DateGroup>
                <DateLabel>📅 This Week</DateLabel>
                {groupedNotifications.thisWeek.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    $read={notif.read}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <NotificationIcon type={notif.type}>
                      {getNotificationIcon(notif.type)}
                    </NotificationIcon>
                    
                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle>{notif.title}</NotificationTitle>
                        <NotificationTime>{formatTime(notif.createdAt)}</NotificationTime>
                      </NotificationHeader>
                      
                      <NotificationMessage>{notif.message}</NotificationMessage>
                      
                      <NotificationActions>
                        {notif.actionUrl && (
                          <ActionButton $primary onClick={() => navigate(notif.actionUrl)}>
                            View Details
                          </ActionButton>
                        )}
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}>
                          Delete
                        </ActionButton>
                      </NotificationActions>
                    </NotificationContent>
                  </NotificationCard>
                ))}
              </DateGroup>
            )}

            {groupedNotifications.older.length > 0 && (
              <DateGroup>
                <DateLabel>📅 Older</DateLabel>
                {groupedNotifications.older.map((notif) => (
                  <NotificationCard
                    key={notif._id}
                    $read={notif.read}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <NotificationIcon type={notif.type}>
                      {getNotificationIcon(notif.type)}
                    </NotificationIcon>
                    
                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle>{notif.title}</NotificationTitle>
                        <NotificationTime>{formatTime(notif.createdAt)}</NotificationTime>
                      </NotificationHeader>
                      
                      <NotificationMessage>{notif.message}</NotificationMessage>
                      
                      <NotificationActions>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}>
                          Delete
                        </ActionButton>
                      </NotificationActions>
                    </NotificationContent>
                  </NotificationCard>
                ))}
              </DateGroup>
            )}
          </>
        )}
      </NotificationsList>
    </NotificationsContainer>
  );
};

export default Notifications;