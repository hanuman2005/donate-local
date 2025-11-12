// src/pages/Notifications/index.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { useNotifications } from "../../context/NotificationContext"; // ✅ Context added
import api from "../../services/api";
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
  Spinner,
} from "./styledComponents";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { socket } = useSocket();

  // ✅ Using global context for unread count
  const { unreadCount, setUnreadCount, fetchUnreadCount } = useNotifications();

  // Fetch notifications when filter changes
  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // Real-time updates
  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        fetchUnreadCount(); // ✅ refresh global count
      });
      return () => socket.off("newNotification");
    }
  }, [socket]);

  // Fetch all or unread notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = filter === "unread" ? { unreadOnly: true } : {};
      const res = await api.get("/notifications", { params });
      setNotifications(res.data.notifications || []);
      fetchUnreadCount();
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  // Handle clicking notification
  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification._id);
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  // Icon mapping
  const getNotificationIcon = (type) => {
    const icons = {
      new_listing: "🎁",
      message: "💬",
      interest: "👋",
      assignment: "🎉",
      rating: "⭐",
      completion: "✅",
      pickup_completed: "✅",
      system: "📢",
    };
    return icons[type] || "🔔";
  };

  // Format time display
  const formatTime = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  // Group by date
  const groupByDate = (notifs) => {
    const groups = { today: [], yesterday: [], thisWeek: [], older: [] };
    notifs.forEach((n) => {
      const d = new Date(n.createdAt);
      const diffDays = Math.floor((new Date() - d) / 86400000);
      if (diffDays === 0) groups.today.push(n);
      else if (diffDays === 1) groups.yesterday.push(n);
      else if (diffDays < 7) groups.thisWeek.push(n);
      else groups.older.push(n);
    });
    return groups;
  };

  if (loading)
    return (
      <NotificationsContainer>
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      </NotificationsContainer>
    );

  const grouped = groupByDate(notifications);

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
            $active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </FilterButton>
          <FilterButton
            $active={filter === "unread"}
            onClick={() => setFilter("unread")}
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
              {filter === "unread" ? "All caught up!" : "No notifications yet"}
            </EmptyText>
            <EmptySubtext>
              {filter === "unread"
                ? "You have no unread notifications"
                : "We'll notify you when something important happens"}
            </EmptySubtext>
          </EmptyState>
        ) : (
          <>
            {Object.entries(grouped).map(([key, list]) =>
              list.length > 0 ? (
                <DateGroup key={key}>
                  <DateLabel>
                    📅{" "}
                    {key === "today"
                      ? "Today"
                      : key === "yesterday"
                      ? "Yesterday"
                      : key === "thisWeek"
                      ? "This Week"
                      : "Older"}
                  </DateLabel>

                  {list.map((notif) => (
                    <NotificationCard
                      key={notif._id}
                      $read={notif.read}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <NotificationIcon>
                        {getNotificationIcon(notif.type)}
                      </NotificationIcon>
                      <NotificationContent>
                        <NotificationHeader>
                          <NotificationTitle>{notif.title}</NotificationTitle>
                          <NotificationTime>
                            {formatTime(notif.createdAt)}
                          </NotificationTime>
                        </NotificationHeader>
                        <NotificationMessage>
                          {notif.message}
                        </NotificationMessage>
                        <NotificationActions>
                          {notif.actionUrl && (
                            <ActionButton
                              $primary
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(notif.actionUrl);
                              }}
                            >
                              View
                            </ActionButton>
                          )}
                          {!notif.read && (
                            <ActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif._id);
                              }}
                            >
                              Mark Read
                            </ActionButton>
                          )}
                          <ActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif._id);
                            }}
                          >
                            Delete
                          </ActionButton>
                        </NotificationActions>
                      </NotificationContent>
                    </NotificationCard>
                  ))}
                </DateGroup>
              ) : null
            )}
          </>
        )}
      </NotificationsList>
    </NotificationsContainer>
  );
};

export default Notifications;
