// src/components/Schedule/CalendarPicker.js
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const CalendarContainer = styled.div`
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthYear = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;

  &:hover {
    background: var(--primary);
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
`;

const WeekDay = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.5rem 0;
  text-transform: uppercase;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayCell = styled(motion.button)`
  aspect-ratio: 1;
  border: none;
  border-radius: 10px;
  background: ${(props) => {
    if (props.$selected) return "var(--gradient-primary)";
    if (props.$today) return "var(--bg-today)";
    if (props.$hasSlots) return "var(--bg-available)";
    return "transparent";
  }};
  color: ${(props) => {
    if (props.$selected) return "var(--text-on-primary)";
    if (props.$disabled) return "var(--text-muted)";
    if (props.$otherMonth) return "var(--text-muted)";
    return "var(--text-primary)";
  }};
  font-weight: ${(props) => (props.$today || props.$selected ? "700" : "500")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  font-size: 0.9rem;
  position: relative;

  &:hover:not(:disabled) {
    background: ${(props) =>
      props.$selected ? "var(--gradient-primary)" : "var(--bg-hover)"};
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const SlotIndicator = styled.div`
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) =>
    props.$available ? "var(--success)" : "var(--warning)"};
`;

const SelectedDateInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--gradient-secondary);
  border-radius: 12px;
  text-align: center;
`;

const SelectedDateText = styled.p`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CalendarPicker = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  availableSlots = {},
  disabledDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = selectedDate ? new Date(selectedDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Previous month days
    const startDay = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        otherMonth: true,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        otherMonth: false,
      });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        otherMonth: true,
      });
    }

    return days;
  }, [currentMonth]);

  const isDateDisabled = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    if (disabledDates.includes(dateStr)) return true;
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === new Date(selectedDate).toDateString();
  };

  const hasAvailableSlots = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return availableSlots[dateStr]?.length > 0;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    if (day.otherMonth || isDateDisabled(day.date)) return;
    onDateSelect(day.date);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "";
    const d = new Date(selectedDate);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isPrevDisabled = () => {
    if (!minDate) return false;
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    return prevMonth < minMonth;
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavButton onClick={goToPrevMonth} disabled={isPrevDisabled()}>
          ←
        </NavButton>
        <MonthYear>
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </MonthYear>
        <NavButton onClick={goToNextMonth}>→</NavButton>
      </CalendarHeader>

      <WeekDays>
        {WEEKDAYS.map((day) => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDays>

      <DaysGrid>
        <AnimatePresence mode="wait">
          {daysInMonth.map((day, index) => (
            <DayCell
              key={`${day.date.toISOString()}-${index}`}
              onClick={() => handleDateClick(day)}
              disabled={day.otherMonth || isDateDisabled(day.date)}
              $selected={isSelected(day.date)}
              $today={isToday(day.date)}
              $otherMonth={day.otherMonth}
              $disabled={isDateDisabled(day.date)}
              $hasSlots={hasAvailableSlots(day.date)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {day.date.getDate()}
              {hasAvailableSlots(day.date) && !day.otherMonth && (
                <SlotIndicator $available />
              )}
            </DayCell>
          ))}
        </AnimatePresence>
      </DaysGrid>

      {selectedDate && (
        <SelectedDateInfo>
          <SelectedDateText>📅 {formatSelectedDate()}</SelectedDateText>
        </SelectedDateInfo>
      )}
    </CalendarContainer>
  );
};

export default CalendarPicker;
