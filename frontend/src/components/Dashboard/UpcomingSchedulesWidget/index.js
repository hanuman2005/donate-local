// src/components/UpcomingSchedulesWidget/index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { scheduleAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Widget = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ViewAllButton = styled(motion.button)`
  background: none;
  border: none;
  color: #4299e1;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #ebf8ff;
  }
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScheduleItem = styled(motion.div)`
  padding: 1rem;
  background: ${(props) => (props.$highlighted ? "#ebf8ff" : "#f7fafc")};
  border-radius: 12px;
  border-left: 4px solid ${(props) => props.$color || "#4299e1"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ebf8ff;
    transform: translateX(4px);
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
`;

const Title = styled.div`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  ${(props) =>
    props.$type === "urgent"
      ? `
    background: #fee2e2;
    color: #991b1b;
  `
      : `
    background: #d1fae5;
    color: #065f46;
  `}
`;

const DateTime = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #4a5568;
    font-size: 0.85rem;
  }
`;

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.85rem;

  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #a0aec0;

  div {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;

const CountdownBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: ${(props) => (props.$urgent ? "#fee2e2" : "#fef3c7")};
  color: ${(props) => (props.$urgent ? "#991b1b" : "#78350f")};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
`;

const UpcomingSchedulesWidget = ({ limit = 3 }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingSchedules();

    // Refresh every 5 minutes
    const interval = setInterval(fetchUpcomingSchedules, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingSchedules = async () => {
    try {
      const response = await scheduleAPI.getUpcomingSchedules();
      setSchedules(response.data.schedules.slice(0, limit));
    } catch (error) {
      console.error("Fetch upcoming schedules error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntil = (dateTime) => {
    const now = new Date();
    const target = new Date(dateTime);
    const diff = target - now;

    if (diff < 0) return "Past due";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `in ${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? "s" : ""}`;
    return "Soon";
  };

  const isUrgent = (dateTime) => {
    const now = new Date();
    const target = new Date(dateTime);
    const hoursUntil = (target - now) / (1000 * 60 * 60);
    return hoursUntil <= 24 && hoursUntil > 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getUserRole = (schedule) => {
    const userId = localStorage.getItem("userId");
    return schedule.donor._id === userId ? "donor" : "recipient";
  };

  const getOtherParty = (schedule) => {
    return getUserRole(schedule) === "donor"
      ? schedule.recipient
      : schedule.donor;
  };

  if (loading) {
    return (
      <Widget>
        <div style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>
          Loading schedules...
        </div>
      </Widget>
    );
  }

  return (
    <Widget
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Header>
        <h3>📅 Upcoming Pickups</h3>
        {schedules.length > 0 && (
          <ViewAllButton
            onClick={() => navigate("/schedules")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All →
          </ViewAllButton>
        )}
      </Header>

      {schedules.length === 0 ? (
        <EmptyState>
          <div>📅</div>
          <p>No upcoming pickups scheduled</p>
        </EmptyState>
      ) : (
        <ScheduleList>
          {schedules.map((schedule) => {
            const otherParty = getOtherParty(schedule);
            const urgent = isUrgent(schedule.proposedDateTime);

            return (
              <ScheduleItem
                key={schedule._id}
                $highlighted={urgent}
                $color={schedule.status === "confirmed" ? "#10b981" : "#f59e0b"}
                onClick={() => navigate("/schedules")}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ScheduleHeader>
                  <Title>{schedule.listing.title}</Title>
                  <Badge
                    $type={
                      schedule.status === "proposed" ? "pending" : "confirmed"
                    }
                  >
                    {schedule.status === "proposed"
                      ? "⏳ Pending"
                      : "✅ Confirmed"}
                  </Badge>
                </ScheduleHeader>

                <DateTime>
                  <span>📅 {formatDate(schedule.proposedDate)}</span>
                  <span>⏰ {schedule.proposedTime}</span>
                </DateTime>

                <Person>
                  <img
                    src={
                      otherParty.avatar ||
                      `https://ui-avatars.com/api/?name=${otherParty.firstName}`
                    }
                    alt={otherParty.firstName}
                  />
                  <span>
                    {getUserRole(schedule) === "donor" ? "Pickup by" : "From"}{" "}
                    {otherParty.firstName}
                  </span>
                </Person>

                <CountdownBadge $urgent={urgent}>
                  ⏰ {getTimeUntil(schedule.proposedDateTime)}
                </CountdownBadge>
              </ScheduleItem>
            );
          })}
        </ScheduleList>
      )}
    </Widget>
  );
};

export default UpcomingSchedulesWidget;
