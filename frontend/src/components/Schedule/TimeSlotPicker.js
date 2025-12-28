// src/components/Schedule/TimeSlotPicker.js
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PeriodTabs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PeriodTab = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) =>
    props.$active ? "var(--primary)" : "var(--bg-secondary)"};
  color: ${(props) =>
    props.$active ? "var(--text-on-primary)" : "var(--text-secondary)"};

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--primary)" : "var(--bg-hover)"};
  }
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--text-muted);
    border-radius: 3px;
  }
`;

const TimeSlot = styled(motion.button)`
  padding: 0.75rem;
  border: 2px solid
    ${(props) => {
      if (props.$selected) return "var(--primary)";
      if (props.$unavailable) return "var(--border-color)";
      return "var(--border-color)";
    }};
  border-radius: 12px;
  background: ${(props) => {
    if (props.$selected) return "var(--gradient-primary)";
    if (props.$unavailable) return "var(--bg-secondary)";
    return "var(--bg-card)";
  }};
  color: ${(props) => {
    if (props.$selected) return "var(--text-inverse)";
    if (props.$unavailable) return "var(--text-muted)";
    return "var(--text-primary)";
  }};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: ${(props) => (props.$unavailable ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  text-decoration: ${(props) => (props.$unavailable ? "line-through" : "none")};

  &:hover:not(:disabled) {
    border-color: var(--primary);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const NoSlotsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);

  span {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const SelectedTimeInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const TimeDisplay = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
`;

const TimePeriod = styled.span`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const PERIODS = [
  { id: "morning", label: "Morning", icon: "🌅", start: 6, end: 12 },
  { id: "afternoon", label: "Afternoon", icon: "☀️", start: 12, end: 17 },
  { id: "evening", label: "Evening", icon: "🌆", start: 17, end: 21 },
];

const generateTimeSlots = (startHour, endHour, interval = 30) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time24 = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const hour12 = hour % 12 || 12;
      const period = hour < 12 ? "AM" : "PM";
      const time12 = `${hour12}:${minute
        .toString()
        .padStart(2, "0")} ${period}`;
      slots.push({ time24, time12 });
    }
  }
  return slots;
};

const TimeSlotPicker = ({
  selectedTime,
  onTimeSelect,
  unavailableSlots = [],
  date,
  interval = 30,
}) => {
  const [activePeriod, setActivePeriod] = useState("morning");

  const currentPeriod = PERIODS.find((p) => p.id === activePeriod);

  const slots = useMemo(() => {
    if (!currentPeriod) return [];
    return generateTimeSlots(currentPeriod.start, currentPeriod.end, interval);
  }, [currentPeriod, interval]);

  const isSlotUnavailable = (time24) => {
    return unavailableSlots.includes(time24);
  };

  const isSlotPast = (time24) => {
    if (!date) return false;
    const now = new Date();
    const [hours, minutes] = time24.split(":").map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate < now;
  };

  const formatSelectedTime = () => {
    if (!selectedTime) return "";
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const hour12 = hours % 12 || 12;
    const period = hours < 12 ? "AM" : "PM";
    return { time: `${hour12}:${minutes.toString().padStart(2, "0")}`, period };
  };

  const selectedTimeFormatted = formatSelectedTime();

  return (
    <Container>
      <Header>
        <Title>🕐 Select Time</Title>
        <PeriodTabs>
          {PERIODS.map((period) => (
            <PeriodTab
              key={period.id}
              $active={activePeriod === period.id}
              onClick={() => setActivePeriod(period.id)}
            >
              {period.icon} {period.label}
            </PeriodTab>
          ))}
        </PeriodTabs>
      </Header>

      {slots.length > 0 ? (
        <SlotsGrid>
          {slots.map((slot) => {
            const isUnavailable =
              isSlotUnavailable(slot.time24) || isSlotPast(slot.time24);
            return (
              <TimeSlot
                key={slot.time24}
                onClick={() => !isUnavailable && onTimeSelect(slot.time24)}
                $selected={selectedTime === slot.time24}
                $unavailable={isUnavailable}
                disabled={isUnavailable}
                whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                whileTap={!isUnavailable ? { scale: 0.95 } : {}}
              >
                {slot.time12}
              </TimeSlot>
            );
          })}
        </SlotsGrid>
      ) : (
        <NoSlotsMessage>
          <span>😴</span>
          No time slots available for this period
        </NoSlotsMessage>
      )}

      {selectedTime && (
        <SelectedTimeInfo>
          <span>⏰</span>
          <TimeDisplay>{selectedTimeFormatted.time}</TimeDisplay>
          <TimePeriod>{selectedTimeFormatted.period}</TimePeriod>
        </SelectedTimeInfo>
      )}
    </Container>
  );
};

export default TimeSlotPicker;
