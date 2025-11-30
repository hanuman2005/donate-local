// src/pages/Schedules/index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { scheduleAPI } from "../../services/api";
import { toast } from "react-toastify";
import ScheduleCard from "../../components/ScheduleCard";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
`;

const Tab = styled(motion.button)`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: ${(props) => (props.$active ? "#4299e1" : "#718096")};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  white-space: nowrap;

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #4299e1;
    }
  `}

  &:hover {
    color: #4299e1;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.$active ? "#4299e1" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#ebf8ff" : "white")};
  color: ${(props) => (props.$active ? "#2c5282" : "#4a5568")};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4299e1;
    background: #ebf8ff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  div {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
    font-size: 1rem;
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  font-size: 2rem;
`;

const SchedulesPage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, donor, recipient
  const [statusFilter, setStatusFilter] = useState("all"); // all, proposed, confirmed, completed

  useEffect(() => {
    fetchSchedules();
  }, [activeTab, statusFilter]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const params = {};

      if (activeTab !== "all") {
        params.role = activeTab;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await scheduleAPI.getMySchedules(params);
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error("Fetch schedules error:", error);
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    fetchSchedules();
  };

  const getUserRole = (schedule) => {
    const userId = localStorage.getItem("userId"); // Adjust based on your auth context
    return schedule.donor._id === userId ? "donor" : "recipient";
  };

  const filteredSchedules = schedules;

  return (
    <Container>
      <Header>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📅 My Pickup Schedules
        </motion.h1>
        <p>Manage your pickup appointments</p>
      </Header>

      <Tabs>
        <Tab
          $active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          All Schedules
        </Tab>
        <Tab
          $active={activeTab === "donor"}
          onClick={() => setActiveTab("donor")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          As Donor
        </Tab>
        <Tab
          $active={activeTab === "recipient"}
          onClick={() => setActiveTab("recipient")}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          As Recipient
        </Tab>
      </Tabs>

      <FilterGroup>
        <FilterButton
          $active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Status
        </FilterButton>
        <FilterButton
          $active={statusFilter === "proposed"}
          onClick={() => setStatusFilter("proposed")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⏳ Pending
        </FilterButton>
        <FilterButton
          $active={statusFilter === "confirmed"}
          onClick={() => setStatusFilter("confirmed")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✅ Confirmed
        </FilterButton>
        <FilterButton
          $active={statusFilter === "completed"}
          onClick={() => setStatusFilter("completed")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎉 Completed
        </FilterButton>
      </FilterGroup>

      {loading ? (
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          ⏳
        </LoadingSpinner>
      ) : filteredSchedules.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div>📅</div>
          <h3>No schedules found</h3>
          <p>
            {statusFilter === "all"
              ? "You don't have any pickup schedules yet"
              : `No ${statusFilter} schedules found`}
          </p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredSchedules.map((schedule) => (
            <ScheduleCard
              key={schedule._id}
              schedule={schedule}
              userRole={getUserRole(schedule)}
              onUpdate={handleUpdate}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SchedulesPage;
