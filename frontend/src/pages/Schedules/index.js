// src/pages/Schedules/index.js - Enhanced with Advanced UI
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import ScheduleCard from "../../components/Schedule/ScheduleCard";
import { useNavigate } from "react-router-dom";
import TrackingModal from "../../components/Tracking/TrackingModal.js";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";
import {
  Container,
  Header,
  HeaderLeft,
  ViewToggle,
  ViewButton,
  StatsRow,
  StatCard,
  StatIcon,
  StatContent,
  StatValue,
  StatLabel,
  Tabs,
  Tab,
  TabCount,
  FilterRow,
  FilterGroup,
  FilterButton,
  SortSelect,
  Grid,
  ListView,
  ListItem,
  ListItemImage,
  ListItemContent,
  ListItemTitle,
  ListItemMeta,
  StatusBadge,
  ActionButtons,
  ActionButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  LoadingContainer,
  LoadingSpinner,
  Spinner,
} from "./styledComponents";

const STATUS_FILTERS = [
  { id: "all", label: "All", icon: "📋" },
  { id: "proposed", label: "Pending", icon: "⏳" },
  { id: "confirmed", label: "Confirmed", icon: "✅" },
  { id: "completed", label: "Completed", icon: "🎉" },
];

const SchedulesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date-desc");
  const [trackingScheduleId, setTrackingScheduleId] = useState(null);

  const handleCancel = async (scheduleId) => {
    try {
      await scheduleAPI.cancelSchedule(scheduleId);
      toast.success("Schedule cancelled");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to cancel schedule");
    }
  };
  useEffect(() => {
    fetchSchedules();
  }, [activeTab, statusFilter]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== "all") {
        params.role = activeTab;
      }
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await scheduleAPI.getMySchedules(params);
      setSchedules(response.data?.schedules || response.schedules || []);
    } catch (error) {
      console.error("Fetch schedules error:", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (scheduleId) => {
    try {
      if (loading) {
        return (
          <Container>
            <Header>
              <h1>Schedules</h1>
            </Header>
            <LoadingContainer>
              <LoadingSkeleton width="100%" height="8rem" />
              <p aria-live="polite">Loading schedules...</p>
            </LoadingContainer>
          </Container>
        );
      }
    } catch (error) {
      toast.error("Failed to cancel schedule");
    }
  };

  const handleComplete = async (scheduleId) => {
    try {
      await scheduleAPI.completeSchedule(scheduleId);
      toast.success("Pickup completed! 🎉");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to complete schedule");
    }
  };

  const handleTrack = (scheduleId) => {
    setTrackingScheduleId(scheduleId);
  };

  const stats = useMemo(
    () => ({
      total: schedules.length,
      pending: schedules.filter((s) => s.status === "proposed").length,
      confirmed: schedules.filter((s) => s.status === "confirmed").length,
      completed: schedules.filter((s) => s.status === "completed").length,
    }),
    [schedules]
  );

  const sortedSchedules = useMemo(() => {
    const sorted = [...schedules];
    switch (sortBy) {
      case "date-asc":
        return sorted.sort(
          (a, b) => new Date(a.proposedDateTime) - new Date(b.proposedDateTime)
        );
      case "date-desc":
        return sorted.sort(
          (a, b) => new Date(b.proposedDateTime) - new Date(a.proposedDateTime)
        );
      case "status":
        const statusOrder = {
          proposed: 0,
          confirmed: 1,
          completed: 2,
          cancelled: 3,
        };
        return sorted.sort(
          (a, b) => statusOrder[a.status] - statusOrder[b.status]
        );
      default:
        return sorted;
    }
  }, [schedules, sortBy]);

  const getUserRole = (schedule) => {
    if (!user) return "donor";
    return schedule.donor?._id === user._id ? "donor" : "recipient";
  };

  const formatDateTime = (schedule) => {
    const date = new Date(schedule.proposedDate || schedule.confirmedDate);
    const time = schedule.proposedTime || schedule.confirmedTime;
    return `${date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} at ${time}`;
  };

  const tabCounts = useMemo(
    () => ({
      all: schedules.length,
      donor: schedules.filter((s) => s.donor?._id === user?._id).length,
      recipient: schedules.filter((s) => s.recipient?._id === user?._id).length,
    }),
    [schedules, user]
  );

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <Spinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>
            Loading schedules...
          </p>
        </LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            📅 My Schedules
          </motion.h1>
          <p>Manage your pickup appointments</p>
        </HeaderLeft>
        <ViewToggle>
          <ViewButton
            $active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          >
            ⊞ Grid
          </ViewButton>
          <ViewButton
            $active={viewMode === "list"}
            onClick={() => setViewMode("list")}
          >
            ≡ List
          </ViewButton>
        </ViewToggle>
      </Header>

      <StatsRow>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatIcon $gradient="var(--staticon-total-gradient)">📋</StatIcon>
          <StatContent>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Schedules</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon $gradient="var(--staticon-pending-gradient)">⏳</StatIcon>
          <StatContent>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon $gradient="var(--staticon-confirmed-gradient)">✅</StatIcon>
          <StatContent>
            <StatValue>{stats.confirmed}</StatValue>
            <StatLabel>Confirmed</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon $gradient="var(--staticon-completed-gradient)">🎉</StatIcon>
          <StatContent>
            <StatValue>{stats.completed}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatContent>
        </StatCard>
      </StatsRow>

      <Tabs>
        <Tab $active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All
          <TabCount $active={activeTab === "all"}>{tabCounts.all}</TabCount>
        </Tab>
        <Tab
          $active={activeTab === "donor"}
          onClick={() => setActiveTab("donor")}
        >
          As Donor
          <TabCount $active={activeTab === "donor"}>{tabCounts.donor}</TabCount>
        </Tab>
        <Tab
          $active={activeTab === "recipient"}
          onClick={() => setActiveTab("recipient")}
        >
          As Recipient
          <TabCount $active={activeTab === "recipient"}>
            {tabCounts.recipient}
          </TabCount>
        </Tab>
      </Tabs>

      <FilterRow>
        <FilterGroup>
          {STATUS_FILTERS.map((filter) => (
            <FilterButton
              key={filter.id}
              $active={statusFilter === filter.id}
              onClick={() => setStatusFilter(filter.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter.icon} {filter.label}
            </FilterButton>
          ))}
        </FilterGroup>
        <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="status">By Status</option>
        </SortSelect>
      </FilterRow>

      <AnimatePresence mode="wait">
        {sortedSchedules.length === 0 ? (
          <EmptyState
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyIcon>📅</EmptyIcon>
            <EmptyTitle>No schedules found</EmptyTitle>
            <EmptyText>
              {statusFilter === "all"
                ? "You don't have any pickup schedules yet"
                : `No ${statusFilter} schedules found`}
            </EmptyText>
          </EmptyState>
        ) : viewMode === "grid" ? (
          <Grid key="grid">
            {sortedSchedules.map((schedule, index) => (
              <motion.div
                key={schedule._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/schedules/${schedule._id}`)}
              >
                <ScheduleCard
                  schedule={schedule}
                  userRole={getUserRole(schedule)}
                  onUpdate={fetchSchedules}
                  onTrack={() => handleTrack(schedule._id)}
                />
              </motion.div>
            ))}
          </Grid>
        ) : (
          <ListView key="list">
            {sortedSchedules.map((schedule, index) => (
              <ListItem
                key={schedule._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/schedules/${schedule._id}`)}
              >
                <ListItemImage $image={schedule.listing?.images?.[0]}>
                  {!schedule.listing?.images?.[0] && "📦"}
                </ListItemImage>

                <ListItemContent>
                  <ListItemTitle>
                    {schedule.listing?.title || "Donation Pickup"}
                  </ListItemTitle>
                  <ListItemMeta>
                    <span>📅 {formatDateTime(schedule)}</span>
                    <span>
                      📍{" "}
                      {schedule.pickupAddress?.slice(0, 30) || "Location TBD"}
                      ...
                    </span>
                  </ListItemMeta>
                </ListItemContent>

                <StatusBadge $status={schedule.status}>
                  {schedule.status}
                </StatusBadge>

                <ActionButtons>
                  {schedule.status === "confirmed" && (
                    <ActionButton
                      $primary
                      onClick={() => handleTrack(schedule._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🚗 Track
                    </ActionButton>
                  )}
                  {schedule.status === "proposed" &&
                    getUserRole(schedule) === "recipient" && (
                      <ActionButton
                        $success
                        onClick={() => handleConfirm(schedule._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✓ Confirm
                      </ActionButton>
                    )}
                  {schedule.status === "confirmed" &&
                    getUserRole(schedule) === "donor" && (
                      <ActionButton
                        $success
                        onClick={() => handleComplete(schedule._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ✓ Complete
                      </ActionButton>
                    )}
                  {["proposed", "confirmed"].includes(schedule.status) && (
                    <ActionButton
                      $danger
                      onClick={() => handleCancel(schedule._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✕
                    </ActionButton>
                  )}
                </ActionButtons>
              </ListItem>
            ))}
          </ListView>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <TrackingModal
        isOpen={!!trackingScheduleId}
        onClose={() => setTrackingScheduleId(null)}
        scheduleId={trackingScheduleId}
      />
    </Container>
  );
};

export default SchedulesPage;
