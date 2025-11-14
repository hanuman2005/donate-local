import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../services/api";

const CenterCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CenterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
`;

const CenterName = styled.h2`
  color: #2d3748;
  margin: 0;
  font-size: 1.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${(props) => (props.$isOpen ? "#48bb78" : "#e53e3e")};
  color: white;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  color: #2d3748;
  font-weight: 600;
`;

const MapButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

const HoursTable = styled.div`
  margin-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const HourRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: ${(props) => (props.$isToday ? "#667eea" : "#4a5568")};
  font-weight: ${(props) => (props.$isToday ? "600" : "normal")};
`;

const DonationCenterInfo = ({ centerId }) => {
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenterInfo();
  }, [centerId]);

  const fetchCenterInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/donation-centers/${centerId}`);
      setCenter(response.data.center);
    } catch (error) {
      console.error("Error fetching center info:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = () => {
    if (!center?.hours) return false;

    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    const todayHours = center.hours[day];
    if (!todayHours || todayHours.closed) return false;

    const [openHour, openMinute] = todayHours.open.split(":").map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(":").map(Number);

    const openTime = openHour + openMinute / 60;
    const closeTime = closeHour + closeMinute / 60;

    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openGoogleMaps = () => {
    const address = encodeURIComponent(center.address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank"
    );
  };

  const getCurrentDay = () => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  };

  if (loading) {
    return <div>Loading center information...</div>;
  }

  if (!center) {
    return <div>Center information not available</div>;
  }

  return (
    <CenterCard>
      <CenterHeader>
        <CenterName>{center.name}</CenterName>
        <StatusBadge $isOpen={isOpen()}>
          {isOpen() ? "🟢 Open Now" : "🔴 Closed"}
        </StatusBadge>
      </CenterHeader>

      <InfoGrid>
        <InfoItem>
          <InfoIcon>📍</InfoIcon>
          <InfoContent>
            <InfoLabel>Address</InfoLabel>
            <InfoValue>{center.address}</InfoValue>
          </InfoContent>
        </InfoItem>

        <InfoItem>
          <InfoIcon>📞</InfoIcon>
          <InfoContent>
            <InfoLabel>Phone</InfoLabel>
            <InfoValue>{center.phone}</InfoValue>
          </InfoContent>
        </InfoItem>

        <InfoItem>
          <InfoIcon>🚗</InfoIcon>
          <InfoContent>
            <InfoLabel>Distance</InfoLabel>
            <InfoValue>{center.distance || "Calculating..."}</InfoValue>
          </InfoContent>
        </InfoItem>

        <InfoItem>
          <InfoIcon>📦</InfoIcon>
          <InfoContent>
            <InfoLabel>Items Accepted</InfoLabel>
            <InfoValue>{center.acceptedItems?.join(", ")}</InfoValue>
          </InfoContent>
        </InfoItem>
      </InfoGrid>

      <MapButton onClick={openGoogleMaps}>🗺️ Get Directions</MapButton>

      {center.hours && (
        <HoursTable>
          <h3 style={{ marginBottom: "1rem", color: "#2d3748" }}>
            Operating Hours
          </h3>
          {Object.entries(center.hours).map(([day, hours]) => (
            <HourRow key={day} $isToday={day === getCurrentDay()}>
              <span>{day}</span>
              <span>
                {hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}
              </span>
            </HourRow>
          ))}
        </HoursTable>
      )}

      {center.specialNotes && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#fff5e6",
            borderRadius: "8px",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <strong>📝 Special Notes:</strong>
          <p style={{ margin: "0.5rem 0 0 0", color: "#78350f" }}>
            {center.specialNotes}
          </p>
        </div>
      )}
    </CenterCard>
  );
};

export default DonationCenterInfo;
