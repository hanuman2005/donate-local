import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatsContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  animation: ${slideIn} 0.6s ease-out;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StatBox = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  ${(props) =>
    props.$pulse &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-family: "Arial", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LiveDot = styled.div`
  width: 10px;
  height: 10px;
  background: #48bb78;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

const RecentActivity = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  animation: ${slideIn} 0.3s ease-out;
`;

const LiveStats = () => {
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonors: 0,
    itemsShared: 0,
    kgSaved: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchStats();

    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates
    socket.on("newDonation", (data) => {
      setStats((prev) => ({
        ...prev,
        totalDonations: prev.totalDonations + 1,
        itemsShared: prev.itemsShared + (data.quantity || 1),
      }));

      setRecentActivities((prev) => [
        {
          id: data._id,
          text: `🎁 ${data.title} donated by ${data.donor}`,
          time: new Date(),
        },
        ...prev.slice(0, 4),
      ]);

      setLastUpdate(new Date());
    });

    socket.on("donationCompleted", (data) => {
      setStats((prev) => ({
        ...prev,
        kgSaved: prev.kgSaved + (data.quantity || 1),
      }));

      setRecentActivities((prev) => [
        {
          id: data._id,
          text: `✅ ${data.title} picked up!`,
          time: new Date(),
        },
        ...prev.slice(0, 4),
      ]);
    });

    return () => {
      socket.off("newDonation");
      socket.off("donationCompleted");
    };
  }, [socket]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/analytics/user"); // ✔ personal analytics

      const analytics = response.data.analytics || {};

      setStats({
        totalDonations: analytics.totalListings || 0,
        activeDonors: analytics.activeListings || 0,
        itemsShared: analytics.completedListings || 0,
        kgSaved: Math.floor((analytics.completedListings || 0) * 2.5),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);

      setStats({
        totalDonations: 0,
        activeDonors: 0,
        itemsShared: 0,
        kgSaved: 0,
      });
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <StatsContainer>
      <LiveIndicator>
        <LiveDot />
        <span>LIVE IMPACT TRACKER</span>
      </LiveIndicator>

      <h2 style={{ margin: 0, fontSize: "1.5rem" }}>🌟 Community Impact</h2>

      <StatsGrid>
        <StatBox $pulse={lastUpdate}>
          <StatValue>{formatNumber(stats.totalDonations)}</StatValue>
          <StatLabel>Total Donations</StatLabel>
        </StatBox>

        <StatBox>
          <StatValue>{formatNumber(stats.activeDonors)}</StatValue>
          <StatLabel>Active Donors</StatLabel>
        </StatBox>

        <StatBox>
          <StatValue>{formatNumber(stats.itemsShared)}</StatValue>
          <StatLabel>Items Shared</StatLabel>
        </StatBox>

        <StatBox>
          <StatValue>{formatNumber(stats.kgSaved)} kg</StatValue>
          <StatLabel>Food Saved</StatLabel>
        </StatBox>
      </StatsGrid>

      {recentActivities.length > 0 && (
        <RecentActivity>
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem", opacity: 0.9 }}>
            ⚡ Recent Activity
          </h3>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={activity.id + index}>
              <span>{activity.text}</span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.85rem",
                  opacity: 0.8,
                }}
              >
                {Math.floor((new Date() - activity.time) / 1000)}s ago
              </span>
            </ActivityItem>
          ))}
        </RecentActivity>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          fontSize: "0.85rem",
          opacity: 0.8,
          textAlign: "center",
        }}
      >
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </StatsContainer>
  );
};

export default LiveStats;
