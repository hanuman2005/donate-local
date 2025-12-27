// src/pages/Schedules/index.js - Enhanced with Advanced UI
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import ScheduleCard from "../../components/Schedule/ScheduleCard";
import { TrackingModal } from "../../components/Tracking";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const HeaderLeft = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 0.375rem;
  border-radius: 12px;
`;

const ViewButton = styled.button`
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.$active ? "var(--primary)" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "var(--text-secondary)")};

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--primary)" : "var(--bg-tertiary)"};
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${(props) => props.$gradient || "var(--bg-secondary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: var(--bg-secondary);
  padding: 0.375rem;
  border-radius: 12px;
  width: fit-content;
`;

const Tab = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  background: ${(props) => (props.$active ? "var(--bg-card)" : "transparent")};
  border: none;
  color: ${(props) =>
    props.$active ? "var(--text-primary)" : "var(--text-secondary)"};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: ${(props) => (props.$active ? "var(--shadow-sm)" : "none")};

  &:hover {
    color: var(--text-primary);
  }
`;

const TabCount = styled.span`
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  background: ${(props) =>
    props.$active ? "var(--primary)" : "var(--bg-secondary)"};
  color: ${(props) => (props.$active ? "white" : "var(--text-secondary)")};
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid
    ${(props) => (props.$active ? "var(--primary)" : "var(--border-color)")};
  background: ${(props) =>
    props.$active ? "rgba(102, 126, 234, 0.1)" : "var(--bg-card)"};
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: var(--primary);
  }
`;

const SortSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ListItem = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
  }
`;

const ListItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background: ${(props) =>
    props.$image ? `url(${props.$image})` : "var(--bg-secondary)"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const ListItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListItemTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ListItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const StatusBadge = styled.span`
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.$status) {
      case "confirmed":
        return "rgba(72, 187, 120, 0.15)";
      case "proposed":
        return "rgba(237, 137, 54, 0.15)";
      case "completed":
        return "rgba(102, 126, 234, 0.15)";
      case "cancelled":
        return "rgba(245, 101, 101, 0.15)";
      default:
        return "var(--bg-secondary)";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "confirmed":
        return "#38a169";
      case "proposed":
        return "#dd6b20";
      case "completed":
        return "#667eea";
      case "cancelled":
        return "#e53e3e";
      default:
        return "var(--text-secondary)";
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) =>
    props.$primary
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : props.$success
      ? "linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
      : props.$danger
      ? "rgba(245, 101, 101, 0.1)"
      : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$primary || props.$success
      ? "white"
      : props.$danger
      ? "#e53e3e"
      : "var(--text-primary)"};

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: 20px;
  border: 2px dashed var(--border-color);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
`;

const EmptyText = styled.p`
  color: var(--text-secondary);
  margin: 0;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`;

const Spinner = styled(motion.div)`
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
`;

const STATUS_FILTERS = [
  { id: "all", label: "All", icon: "📋" },
  { id: "proposed", label: "Pending", icon: "⏳" },
  { id: "confirmed", label: "Confirmed", icon: "✅" },
  { id: "completed", label: "Completed", icon: "🎉" },
];

const SchedulesPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("date-desc");
  const [trackingScheduleId, setTrackingScheduleId] = useState(null);

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
      await scheduleAPI.confirmSchedule(scheduleId);
      toast.success("Schedule confirmed! 🎉");
      fetchSchedules();
    } catch (error) {
      toast.error("Failed to confirm schedule");
    }
  };

  const handleCancel = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to cancel this schedule?"))
      return;
    try {
      await scheduleAPI.cancelSchedule(scheduleId);
      toast.success("Schedule cancelled");
      fetchSchedules();
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
          <StatIcon $gradient="linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)">
            📋
          </StatIcon>
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
          <StatIcon $gradient="linear-gradient(135deg, rgba(237, 137, 54, 0.2) 0%, rgba(246, 173, 85, 0.2) 100%)">
            ⏳
          </StatIcon>
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
          <StatIcon $gradient="linear-gradient(135deg, rgba(72, 187, 120, 0.2) 0%, rgba(104, 211, 145, 0.2) 100%)">
            ✅
          </StatIcon>
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
          <StatIcon $gradient="linear-gradient(135deg, rgba(159, 122, 234, 0.2) 0%, rgba(183, 148, 244, 0.2) 100%)">
            🎉
          </StatIcon>
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
