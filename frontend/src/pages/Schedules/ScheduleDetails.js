import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import styled from "styled-components";

// Styled button for navigation
const StyledButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: var(--gradient-primary);
  color: var(--text-button);
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  &:hover,
  &:focus {
    background: var(--gradient-secondary);
    transform: translateY(-2px) scale(1.03);
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
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  margin-bottom: 1.5rem;
  p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1rem;
  background: ${({ $status }) => {
    switch ($status) {
      case "proposed":
        return "var(--badge-proposed-bg)";
      case "confirmed":
        return "var(--badge-confirmed-bg)";
      case "completed":
        return "var(--badge-completed-bg)";
      case "cancelled":
        return "var(--badge-cancelled-bg)";
      case "expired":
        return "var(--badge-expired-bg)";
      default:
        return "var(--badge-default-bg)";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "proposed":
        return "var(--badge-proposed-text)";
      case "confirmed":
        return "var(--badge-confirmed-text)";
      case "completed":
        return "var(--badge-completed-text)";
      case "cancelled":
        return "var(--badge-cancelled-text)";
      case "expired":
        return "var(--badge-expired-text)";
      default:
        return "var(--badge-default-text)";
    }
  }};
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

  if (loading) return <Container>Loading...</Container>;
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
      <StatusBadge $status={status}>{status?.toUpperCase()}</StatusBadge>
      <Info>
        <p>
          <strong>Item:</strong> {listing?.title}
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
        Back to Schedules
      </StyledButton>
    </Container>
  );
};

export default ScheduleDetails;
