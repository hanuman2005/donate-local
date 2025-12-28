// src/components/ScheduleCard/index.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { scheduleAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { getCalendarLinks } from "../../utils/calendarUtils";

const formatLocation = (pickupLocation) => {
  if (!pickupLocation) return "Not specified";

  // If it's already a string (old data)
  if (typeof pickupLocation === "string") return pickupLocation;

  // New format: { address, coordinates: [lng, lat] }
  if (pickupLocation.address) return pickupLocation.address;

  if (
    Array.isArray(pickupLocation.coordinates) &&
    pickupLocation.coordinates.length === 2
  ) {
    const [lng, lat] = pickupLocation.coordinates;
    return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  }

  return "Unknown location";
};

const Card = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid ${(props) => props.$statusColor || "var(--primary)"};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ListingInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  ${(props) => {
    switch (props.$status) {
      case "proposed":
        return "background: var(--bg-warning); color: var(--warning);";
      case "confirmed":
        return "background: var(--bg-success); color: var(--success);";
      case "completed":
        return "background: var(--bg-completed); color: var(--completed);";
      case "cancelled":
        return "background: var(--bg-cancelled); color: var(--cancelled);";
      case "expired":
        return "background: var(--bg-expired); color: var(--expired);";
      default:
        return "background: var(--bg-default); color: var(--text-secondary);";
    }
  }}
`;

const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
`;

const DateTimeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span:first-child {
    font-size: 1.5rem;
  }

  div {
    strong {
      display: block;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    span {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
  }
`;

const PartyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 10px;
  margin-bottom: 0.75rem;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    flex: 1;

    strong {
      display: block;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    span {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
  }
`;

const Location = styled.div`
  display: flex;
  align-items: start;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;

  span:first-child {
    font-size: 1.2rem;
  }
`;

const Notes = styled.div`
  background: var(--bg-warning-light);
  border-left: 3px solid var(--warning);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  p {
    margin: 0;
    color: var(--warning);
    font-size: 0.9rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  ${(props) =>
    props.$variant === "primary"
      ? `
    background: var(--gradient-success);
    color: var(--text-on-primary);
  `
      : props.$variant === "danger"
      ? `
    background: var(--gradient-danger);
    color: var(--text-on-primary);
  `
      : `
    background: var(--bg-secondary);
    color: var(--text-secondary);
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const CalendarDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const CalendarButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const CalendarMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 200px;
  z-index: 100;
`;

const CalendarMenuItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: var(--bg-secondary);
  }

  span:first-child {
    font-size: 1.1rem;
  }
`;

const ScheduleCard = ({ schedule, userRole, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState("");
  const [showConfirmInput, setShowConfirmInput] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  // Close calendar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendarMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calendarLinks = getCalendarLinks(schedule);

  const getStatusColor = () => {
    switch (schedule.status) {
      case "proposed":
        return "#f59e0b";
      case "confirmed":
        return "#10b981";
      case "completed":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      case "expired":
        return "#9ca3af";
      default:
        return "#4299e1";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await scheduleAPI.confirmSchedule(schedule._id, {
        confirmationNotes: confirmNotes,
      });

      toast.success("✅ Schedule confirmed successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm schedule"
      );
    } finally {
      setLoading(false);
      setShowConfirmInput(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this pickup?")) return;

    const reason = prompt(
      "Please provide a reason for cancellation (optional):"
    );

    setLoading(true);
    try {
      await scheduleAPI.cancelSchedule(schedule._id, {
        cancellationReason: reason || "",
      });

      toast.success("Schedule cancelled");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm("Mark this pickup as completed?")) return;

    setLoading(true);
    try {
      await scheduleAPI.completeSchedule(schedule._id);
      toast.success("🎉 Pickup completed successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to complete schedule"
      );
    } finally {
      setLoading(false);
    }
  };

  const otherParty = userRole === "donor" ? schedule.recipient : schedule.donor;

  return (
    <Card
      $statusColor={getStatusColor()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Header>
        <ListingInfo>
          <h3>{schedule.listing?.title || "Item"}</h3>
          <span style={{ color: "#718096", fontSize: "0.9rem" }}>
            {schedule.listing?.category || "Unknown"}
          </span>
        </ListingInfo>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Add to Calendar Button */}
          {(schedule.status === "confirmed" ||
            schedule.status === "proposed") && (
            <CalendarDropdown ref={calendarRef}>
              <CalendarButton
                onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📅 Add to Calendar
              </CalendarButton>
              <AnimatePresence>
                {showCalendarMenu && (
                  <CalendarMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalendarMenuItem
                      href={calendarLinks.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                    >
                      <span>📆</span> Google Calendar
                    </CalendarMenuItem>
                    <CalendarMenuItem
                      href={calendarLinks.outlook}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                    >
                      <span>📧</span> Outlook
                    </CalendarMenuItem>
                    <CalendarMenuItem
                      href={calendarLinks.yahoo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowCalendarMenu(false)}
                    >
                      <span>🟣</span> Yahoo Calendar
                    </CalendarMenuItem>
                    <CalendarMenuItem
                      as="button"
                      onClick={() => {
                        calendarLinks.downloadIcs();
                        setShowCalendarMenu(false);
                        toast.success("📥 Calendar file downloaded!");
                      }}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        textAlign: "left",
                      }}
                    >
                      <span>⬇️</span> Download .ics
                    </CalendarMenuItem>
                  </CalendarMenu>
                )}
              </AnimatePresence>
            </CalendarDropdown>
          )}
          <StatusBadge $status={schedule.status}>
            {schedule.status === "proposed" && "⏳ Pending"}
            {schedule.status === "confirmed" && "✅ Confirmed"}
            {schedule.status === "completed" && "🎉 Completed"}
            {schedule.status === "cancelled" && "❌ Cancelled"}
            {schedule.status === "expired" && "⏰ Expired"}
          </StatusBadge>
        </div>
      </Header>

      <DateTime>
        <DateTimeItem>
          <span>📅</span>
          <div>
            <strong>{formatDate(schedule.proposedDate)}</strong>
            <span>Date</span>
          </div>
        </DateTimeItem>
        <DateTimeItem>
          <span>⏰</span>
          <div>
            <strong>{schedule.proposedTime}</strong>
            <span>Time</span>
          </div>
        </DateTimeItem>
      </DateTime>

      <PartyInfo>
        <img
          src={
            otherParty?.avatar ||
            `https://ui-avatars.com/api/?name=${
              otherParty?.firstName || "User"
            }`
          }
          alt={otherParty?.firstName || "User"}
        />
        <div>
          <strong>
            {otherParty?.firstName || "Unknown"} {otherParty?.lastName || ""}
          </strong>
          <span>{userRole === "donor" ? "Recipient" : "Donor"}</span>
        </div>
      </PartyInfo>

      {schedule.pickupLocation && (
        <Location>
          <span>📍</span>
          <span>{formatLocation(schedule.pickupLocation)}</span>
        </Location>
      )}

      {schedule.donorNotes && (
        <Notes>
          <p>
            <strong>📝 Note:</strong> {schedule.donorNotes}
          </p>
        </Notes>
      )}

      {schedule.confirmationNotes && (
        <Notes>
          <p>
            <strong>✅ Confirmation:</strong> {schedule.confirmationNotes}
          </p>
        </Notes>
      )}

      {/* Action Buttons */}
      {schedule.status === "proposed" && userRole === "recipient" && (
        <>
          {!showConfirmInput ? (
            <ButtonGroup>
              <Button onClick={handleCancel} disabled={loading}>
                ❌ Decline
              </Button>
              <Button
                $variant="primary"
                onClick={() => setShowConfirmInput(true)}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ✅ Confirm Pickup
              </Button>
            </ButtonGroup>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Add confirmation notes (optional)"
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
              />
              <ButtonGroup>
                <Button onClick={() => setShowConfirmInput(false)}>Back</Button>
                <Button
                  $variant="primary"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Confirming..." : "Confirm"}
                </Button>
              </ButtonGroup>
            </>
          )}
        </>
      )}

      {schedule.status === "confirmed" && userRole === "donor" && (
        <ButtonGroup>
          <Button onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            $variant="primary"
            onClick={handleComplete}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            🎉 Mark Complete
          </Button>
        </ButtonGroup>
      )}

      {schedule.status === "confirmed" && userRole === "recipient" && (
        <Button
          onClick={handleCancel}
          disabled={loading}
          style={{ width: "100%" }}
        >
          Cancel Pickup
        </Button>
      )}

      {schedule.status === "proposed" && userRole === "donor" && (
        <Button
          onClick={handleCancel}
          disabled={loading}
          style={{ width: "100%" }}
        >
          Cancel Proposal
        </Button>
      )}

      {schedule.status === "completed" && (
        <Button
          onClick={() => navigate(`/listings/${schedule.listing?._id}`)}
          style={{ width: "100%" }}
        >
          View Listing
        </Button>
      )}
    </Card>
  );
};

export default ScheduleCard;
