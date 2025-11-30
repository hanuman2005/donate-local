// src/components/ScheduleCard/index.js
import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { scheduleAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

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
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${(props) => props.$statusColor || "#4299e1"};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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
    color: #2d3748;
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
        return "background: #fef3c7; color: #92400e;";
      case "confirmed":
        return "background: #d1fae5; color: #065f46;";
      case "completed":
        return "background: #dbeafe; color: #1e40af;";
      case "cancelled":
        return "background: #fee2e2; color: #991b1b;";
      case "expired":
        return "background: #f3f4f6; color: #6b7280;";
      default:
        return "background: #e5e7eb; color: #4b5563;";
    }
  }}
`;

const DateTime = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
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
      color: #2d3748;
      font-size: 0.95rem;
    }

    span {
      color: #718096;
      font-size: 0.85rem;
    }
  }
`;

const PartyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
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
      color: #2d3748;
      font-size: 0.95rem;
    }

    span {
      color: #718096;
      font-size: 0.85rem;
    }
  }
`;

const Location = styled.div`
  display: flex;
  align-items: start;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 8px;

  span:first-child {
    font-size: 1.2rem;
  }
`;

const Notes = styled.div`
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;

  p {
    margin: 0;
    color: #78350f;
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
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
  `
      : props.$variant === "danger"
      ? `
    background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
    color: white;
  `
      : `
    background: #f7fafc;
    color: #4a5568;
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
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const ScheduleCard = ({ schedule, userRole, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState("");
  const [showConfirmInput, setShowConfirmInput] = useState(false);
  const navigate = useNavigate();

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
        <StatusBadge $status={schedule.status}>
          {schedule.status === "proposed" && "⏳ Pending"}
          {schedule.status === "confirmed" && "✅ Confirmed"}
          {schedule.status === "completed" && "🎉 Completed"}
          {schedule.status === "cancelled" && "❌ Cancelled"}
          {schedule.status === "expired" && "⏰ Expired"}
        </StatusBadge>
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
