import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import styled from "styled-components";

const StyledButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: var(--gradient-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-base);
  
  &:hover,
  &:focus {
    transform: translateY(-2px) scale(1.03);
    box-shadow: var(--shadow-xl);
    outline: none;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  background: var(--bg-card);
  color: var(--text-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Info = styled.div`
  margin-bottom: 1.5rem;
  
  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
    color: var(--text-secondary);
    line-height: 1.6;
    
    strong {
      color: var(--text-primary);
      font-weight: 600;
    }
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  background: ${({ $status }) => {
    switch ($status) {
      case "proposed":
        return "var(--warning-bg)";
      case "confirmed":
        return "var(--success-bg)";
      case "completed":
        return "var(--info-bg)";
      case "cancelled":
        return "var(--error-bg)";
      case "expired":
        return "var(--text-muted)";
      default:
        return "var(--bg-secondary)";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "proposed":
        return "var(--warning)";
      case "confirmed":
        return "var(--success)";
      case "completed":
        return "var(--info)";
      case "cancelled":
        return "var(--error)";
      case "expired":
        return "var(--text-secondary)";
      default:
        return "var(--text-primary)";
    }
  }};
  box-shadow: var(--shadow-sm);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
`;

const ScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const res = await scheduleAPI.getMySchedules({ scheduleId: id });
        const found = res.data.schedules?.find((s) => s._id === id);
        if (!found) throw new Error("Schedule not found");
        setSchedule(found);
      } catch (err) {
        toast.error("Failed to load schedule");
        navigate("/schedules");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [id, navigate]);

  if (loading) return <Container><LoadingState>Loading...</LoadingState></Container>;
  if (!schedule) return null;

  const {
    status,
    proposedDate,
    proposedTime,
    pickupLocation,
    pickupAddress,
    donor,
    recipient,
    donorNotes,
    confirmationNotes,
    listing,
  } = schedule;

  return (
    <Container>
      <Title>Pickup Schedule Details</Title>
      <StatusBadge $status={status}>{status}</StatusBadge>
      <Info>
        <p>
          <strong>Item:</strong> {listing?.title || "N/A"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {proposedDate ? new Date(proposedDate).toLocaleDateString() : "-"}
        </p>
        <p>
          <strong>Time:</strong> {proposedTime || "-"}
        </p>
        <p>
          <strong>Location:</strong>{" "}
          {pickupAddress ||
            (typeof pickupLocation === "string"
              ? pickupLocation
              : pickupLocation?.address) ||
            "-"}
        </p>
        <p>
          <strong>Donor:</strong> {donor?.firstName} {donor?.lastName}
        </p>
        <p>
          <strong>Recipient:</strong> {recipient?.firstName}{" "}
          {recipient?.lastName}
        </p>
        {donorNotes && (
          <p>
            <strong>Donor Notes:</strong> {donorNotes}
          </p>
        )}
        {confirmationNotes && (
          <p>
            <strong>Confirmation Notes:</strong> {confirmationNotes}
          </p>
        )}
      </Info>
      <StyledButton onClick={() => navigate("/schedules")}>
        ← Back to Schedules
      </StyledButton>
    </Container>
  );
};

export default ScheduleDetails;