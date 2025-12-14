import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api"; // eslint-disable-next-line no-unused-vars
import LoadingSpinner from "../../components/Common/LoadingSpinner";

// Styled Components
const DashboardWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
    font-size: 1rem;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionBtn = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  `
      : `
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.$color || "linear-gradient(90deg, #667eea, #764ba2)"};
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ViewAllBtn = styled(motion.button)`
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ItemCard = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) =>
    props.$status === "completed"
      ? "rgba(34, 197, 94, 0.1)"
      : "rgba(248, 250, 252, 1)"};
  border-radius: 12px;
  border: 2px solid
    ${(props) =>
      props.$status === "completed"
        ? "#22c55e"
        : props.$status === "pending"
        ? "#667eea"
        : "#e2e8f0"};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ItemIcon = styled.div`
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
  font-size: 1rem;
`;

const ItemMeta = styled.div`
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
`;

const ItemCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) =>
    props.$status === "completed"
      ? "#22c55e"
      : props.$status === "pending"
      ? "#667eea"
      : props.$status === "available"
      ? "#8b5cf6"
      : "#94a3b8"};
  color: white;
`;

const InsightsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InsightCard = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1),
    rgba(118, 75, 162, 0.1)
  );
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const InsightIcon = styled.div`
  font-size: 2rem;
  flex-shrink: 0;
`;

const InsightContent = styled.div`
  h3 {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }

  p {
    color: #64748b;
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: white;
  gap: 1rem;
`;

// Component
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    itemsAnalyzed: 0,
    itemsShared: 0,
    co2Saved: 0,
    wastePrevented: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  const isDonor = user?.userType === "donor" || user?.userType === "both";

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch user's listings
      const listingsResponse = await listingsAPI.getUserListings();
      const listings =
        listingsResponse.data.listings || listingsResponse.data.data || [];

      // Calculate stats from real data
      const completed = listings.filter((l) => l.status === "completed").length;
      const totalWeight = listings.reduce((sum, listing) => {
        return sum + (listing.quantity || 1) * 2; // Estimate 2kg per item
      }, 0);

      setStats({
        itemsAnalyzed: listings.length,
        itemsShared: completed,
        co2Saved: Math.round(totalWeight * 1.5), // CO2 calculation
        wastePrevented: totalWeight,
      });

      // Get recent items (last 5)
      setRecentItems(listings.slice(0, 5));

      // Generate AI insights based on real data
      const insights = [];

      if (listings.length > 0) {
        const categories = [...new Set(listings.map((l) => l.category))];
        insights.push({
          icon: "♻️",
          title: "Top Reuse Potential",
          desc: `You have items in ${categories.length} categories ready for reuse`,
        });
      }

      if (completed > 0) {
        insights.push({
          icon: "🌱",
          title: "Environmental Win",
          desc: `You've prevented ${Math.round(
            totalWeight * 1.5
          )}kg CO₂ - equal to ${Math.round(
            (totalWeight * 1.5) / 13
          )} trees planted!`,
        });
      }

      const available = listings.filter((l) => l.status === "available").length;
      if (available > 0) {
        insights.push({
          icon: "🎯",
          title: "Active Listings",
          desc: `You have ${available} items waiting to find a new home`,
        });
      }

      setAiInsights(insights);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default empty states
      setStats({
        itemsAnalyzed: 0,
        itemsShared: 0,
        co2Saved: 0,
        wastePrevented: 0,
      });
      setRecentItems([]);
      setAiInsights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const handleUploadItem = () => {
    navigate("/create-listing");
  };

  const handleBrowseItems = () => {
    navigate("/listings");
  };

  const handleViewItem = (item) => {
    navigate(`/listings/${item._id}`);
  };

  const handleViewAllItems = () => {
    navigate("/my-items");
  };

  if (loading) {
    return (
      <DashboardWrapper>
        <LoadingContainer>
          <LoadingSpinner size="large" />
          <p>Loading your dashboard...</p>
        </LoadingContainer>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <Container>
        {/* Welcome Section */}
        <WelcomeCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeHeader>
            <WelcomeText>
              <h1>
                {getGreeting()}, {user?.firstName}! 👋
              </h1>
              <p>
                {isDonor
                  ? `Ready to give more items a second life? You've rescued ${stats.itemsShared} items!`
                  : "Discover items that need a second chance in your community"}
              </p>
            </WelcomeText>
            <QuickActions>
              {isDonor && (
                <>
                  <ActionBtn
                    $primary
                    onClick={handleUploadItem}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📸</span> Upload Item
                  </ActionBtn>
                  <ActionBtn
                    onClick={() => navigate("/schedules")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📅</span> My Schedules
                  </ActionBtn>
                  <ActionBtn
                    onClick={() => navigate("/my-pickups")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📦</span> Pending Pickups
                  </ActionBtn>
                </>
              )}
              <ActionBtn
                onClick={handleBrowseItems}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔍</span> Browse
              </ActionBtn>
            </QuickActions>
          </WelcomeHeader>
        </WelcomeCard>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard
            $color="linear-gradient(90deg, #667eea, #764ba2)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <StatIcon>📸</StatIcon>
            <StatValue>{stats.itemsAnalyzed}</StatValue>
            <StatLabel>Items Uploaded</StatLabel>
          </StatCard>

          <StatCard
            $color="linear-gradient(90deg, #22c55e, #16a34a)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <StatIcon>🔄</StatIcon>
            <StatValue>{stats.itemsShared}</StatValue>
            <StatLabel>Items Given New Life</StatLabel>
          </StatCard>

          <StatCard
            $color="linear-gradient(90deg, #06b6d4, #0891b2)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <StatIcon>🌍</StatIcon>
            <StatValue>{stats.co2Saved}kg</StatValue>
            <StatLabel>CO₂ Saved</StatLabel>
          </StatCard>

          <StatCard
            $color="linear-gradient(90deg, #8b5cf6, #7c3aed)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <StatIcon>♻️</StatIcon>
            <StatValue>{stats.wastePrevented}kg</StatValue>
            <StatLabel>Waste Prevented</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          <MainContent>
            {/* Recent Items */}
            <Card
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CardHeader>
                <h2>
                  <span>📦</span> Recent Items
                </h2>
                {recentItems.length > 0 && (
                  <ViewAllBtn
                    onClick={handleViewAllItems}
                    whileHover={{ scale: 1.05 }}
                  >
                    View All →
                  </ViewAllBtn>
                )}
              </CardHeader>

              {recentItems.length > 0 ? (
                <ItemsList>
                  {recentItems.map((item, index) => (
                    <ItemCard
                      key={item._id}
                      $status={item.status}
                      onClick={() => handleViewItem(item)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ItemIcon>
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} />
                        ) : (
                          <span>📦</span>
                        )}
                      </ItemIcon>
                      <ItemInfo>
                        <ItemName>{item.title}</ItemName>
                        <ItemMeta>
                          {formatDate(item.createdAt)} •{" "}
                          <StatusBadge $status={item.status}>
                            {item.status}
                          </StatusBadge>
                        </ItemMeta>
                        <ItemCategory>
                          📂 {item.category || "General"}
                        </ItemCategory>
                      </ItemInfo>
                    </ItemCard>
                  ))}
                </ItemsList>
              ) : (
                <EmptyState>
                  <div className="icon">📭</div>
                  <p>No items yet</p>
                  <ActionBtn $primary onClick={handleUploadItem}>
                    <span>📸</span> Upload Your First Item
                  </ActionBtn>
                </EmptyState>
              )}
            </Card>
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            {/* AI Insights */}
            {aiInsights.length > 0 && (
              <Card
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <CardHeader>
                  <h2>
                    <span>💡</span> Insights
                  </h2>
                </CardHeader>

                <InsightsList>
                  {aiInsights.map((insight, index) => (
                    <InsightCard
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      <InsightIcon>{insight.icon}</InsightIcon>
                      <InsightContent>
                        <h3>{insight.title}</h3>
                        <p>{insight.desc}</p>
                      </InsightContent>
                    </InsightCard>
                  ))}
                </InsightsList>
              </Card>
            )}

            {/* Quick Stats Summary */}
            <Card
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <CardHeader>
                <h2>
                  <span>🌟</span> Your Impact
                </h2>
              </CardHeader>

              <InsightsList>
                <InsightCard
                  style={{
                    background: "rgba(34, 197, 94, 0.1)",
                    borderColor: "#22c55e",
                  }}
                >
                  <InsightIcon>🌱</InsightIcon>
                  <InsightContent>
                    <h3>Environmental Hero</h3>
                    <p>
                      Your actions equal planting{" "}
                      {Math.round(stats.co2Saved / 13)} trees!
                    </p>
                  </InsightContent>
                </InsightCard>

                <InsightCard
                  style={{
                    background: "rgba(102, 126, 234, 0.1)",
                    borderColor: "#667eea",
                  }}
                >
                  <InsightIcon>🤝</InsightIcon>
                  <InsightContent>
                    <h3>Community Champion</h3>
                    <p>
                      You've helped give {stats.itemsShared} items a second life
                    </p>
                  </InsightContent>
                </InsightCard>
              </InsightsList>
            </Card>
          </Sidebar>
        </ContentGrid>
      </Container>
    </DashboardWrapper>
  );
};

export default Dashboard;
