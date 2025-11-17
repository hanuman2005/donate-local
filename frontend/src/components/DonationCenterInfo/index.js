
// ============================================
// src/components/DonationCenterInfo/index.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { motionVariants } from "../../animations/motionVariants";
import { centersAPI } from "../../services/api";

const CenterCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CenterHeader = styled(motion.div)`
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

const StatusBadge = styled(motion.span)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  background: ${(props) => (props.$isOpen ? "#48bb78" : "#e53e3e")};
  color: white;
`;

const InfoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: start;
  gap: 0.75rem;
`;

const MapButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const HoursTable = styled(motion.div)`
  margin-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  padding-top: 1.5rem;
`;

const HourRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: ${(props) => (props.$isToday ? "#667eea" : "#4a5568")};
  font-weight: ${(props) => (props.$isToday ? "600" : "normal")};
`;

const DonationCenterInfo = ({ centerId }) => {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (!centerId) return;

    const fetchData = async () => {
      try {
        const res = await centersAPI.getById(centerId);
        setCenter(res.data.center);
      } catch (err) {
        console.error("Error loading center:", err);
      }
    };

    fetchData();
  }, [centerId]);

  if (!centerId || !center) return null;

  const isOpen = () => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "long" });
    const h = center.hours?.[day];
    if (!h || h.closed) return false;

    const [oh, om] = h.open.split(":").map(Number);
    const [ch, cm] = h.close.split(":").map(Number);
    const current = now.getHours() + now.getMinutes() / 60;

    return current >= oh + om / 60 && current <= ch + cm / 60;
  };

  const openMap = () =>
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        center.address
      )}`,
      "_blank"
    );

  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <CenterCard
      variants={motionVariants.scaleIn}
      initial="hidden"
      animate="show"
    >
      <CenterHeader>
        <CenterName>{center.name}</CenterName>
        <StatusBadge 
          $isOpen={isOpen()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isOpen() ? "🟢 Open Now" : "🔴 Closed"}
        </StatusBadge>
      </CenterHeader>

      <InfoGrid
        variants={motionVariants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        <InfoItem variants={motionVariants.fadeSlideUp}>
          📍 {center.address}
        </InfoItem>
        <InfoItem variants={motionVariants.fadeSlideUp}>
          📞 {center.phone}
        </InfoItem>
        <InfoItem variants={motionVariants.fadeSlideUp}>
          📦 {center.acceptedItems?.join(", ")}
        </InfoItem>
      </InfoGrid>

      <MapButton
        onClick={openMap}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        🗺️ Get Directions
      </MapButton>

      {center.hours && (
        <HoursTable
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
        >
          <h3>Operating Hours</h3>
          {Object.entries(center.hours).map(([day, h], index) => (
            <HourRow
              key={day}
              $isToday={day === currentDay}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span>{day}</span>
              <span>{h.closed ? "Closed" : `${h.open} - ${h.close}`}</span>
            </HourRow>
          ))}
        </HoursTable>
      )}
    </CenterCard>
  );
};

export default DonationCenterInfo;
