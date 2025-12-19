// src/pages/Schedules/ScheduleDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import styled from "styled-components";

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
        return "#fef3c7";
      case "confirmed":
        return "#d1fae5";
      case "completed":
        return "#dbeafe";
      case "cancelled":
        return "#fee2e2";
      case "expired":
        return "#f3f4f6";
      default:
        return "#e5e7eb";
    }
  }};
  color: ${({ $status }) => {
    switch ($status) {
      case "proposed":
        return "#92400e";
      case "confirmed":
        return "#065f46";
      case "completed":
        return "#1e40af";
      case "cancelled":
        return "#991b1b";
      case "expired":
        return "#6b7280";
      default:
        return "#4b5563";
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
      <button onClick={() => navigate("/schedules")}>Back to Schedules</button>
    </Container>
  );
};

export default ScheduleDetails;
