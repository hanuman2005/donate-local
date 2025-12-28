// src/pages/Dashboard/index.js - COMPLETE ENHANCED VERSION
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api";
import { exportDonationsToCSV, downloadJSON } from "../../utils/exportUtils";

import {
  DashboardWrapper,
  Container,
  WelcomeCard,
  WelcomeHeader,
  WelcomeText,
  QuickActions,
  ActionBtn,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  ContentGrid,
  MainContent,
  Sidebar,
  Card,
  CardHeader,
  ViewAllBtn,
  ItemsList,
  ItemCard,
  ItemIcon,
  ItemInfo,
  ItemName,
  ItemMeta,
  ItemCategory,
  StatusBadge,
  EmptyState,
  InsightsList,
  InsightCard,
  InsightIcon,
  InsightContent,
  LoadingContainer,
  QuickActionCard,
  QuickActionsGrid,
  Timeline,
  TimelineItem,
  BadgeContainer,
  Badge,
  ProgressRing,
  FAB,
  GradientHeader,
} from "./styledComponents";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";

// Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
  const [recentActivity, setRecentActivity] = useState([]);

  const isDonor = user?.userType === "donor" || user?.userType === "both";
  const isRecipient = user?.userType === "recipient";

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
        return sum + (listing.quantity || 1) * 2;
      }, 0);

      setStats({
        itemsAnalyzed: listings.length,
        itemsShared: completed,
        co2Saved: Math.round(totalWeight * 1.5),
        wastePrevented: totalWeight,
      });

      // Get recent items (last 5)
      setRecentItems(listings.slice(0, 5));

      // Generate recent activity
      const activity = listings.slice(0, 3).map((item) => ({
        icon:
          item.status === "completed"
            ? "✅"
            : item.status === "pending"
            ? "⏳"
            : "📸",
        title:
          item.status === "completed"
            ? `Completed: ${item.title}`
            : item.status === "pending"
            ? `Pending: ${item.title}`
            : `Uploaded: ${item.title}`,
        time: formatDate(item.createdAt),
      }));
      setRecentActivity(activity);

      // Generate AI insights
      const insights = [];

      if (listings.length > 0) {
        const categories = [...new Set(listings.map((l) => l.category))];
        insights.push({
          icon: "♻️",
          title: "Diverse Contributions",
          desc: `You've shared items across ${categories.length} different categories`,
        });
      }

      if (completed > 0) {
        insights.push({
          icon: "🌱",
          title: "Environmental Champion",
          desc: `You've saved ${Math.round(
            totalWeight * 1.5
          )}kg CO₂ - equivalent to ${Math.round(
            (totalWeight * 1.5) / 13
          )} trees planted!`,
        });
      }

      const available = listings.filter((l) => l.status === "available").length;
      if (available > 0) {
        insights.push({
          icon: "🎯",
          title: "Active Impact",
          desc: `${available} items are currently helping your community`,
        });
      }

      // Add motivational insight
      if (listings.length >= 5) {
        insights.push({
          icon: "⭐",
          title: "Rising Star",
          desc: "You're in the top 20% of active contributors!",
        });
      }

      setAiInsights(insights);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        itemsAnalyzed: 0,
        itemsShared: 0,
        co2Saved: 0,
        wastePrevented: 0,
      });
      setRecentItems([]);
      setAiInsights([]);
      setRecentActivity([]);
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

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
  // Calculate completion rate
  const completionRate =
    stats.itemsAnalyzed > 0
      ? Math.round((stats.itemsShared / stats.itemsAnalyzed) * 100)
      : 0;
  if (loading) {
    return (
      <DashboardWrapper>
        <LoadingContainer>
          <LoadingSkeleton width="100%" height="8rem" />
          <p aria-live="polite">Loading your dashboard...</p>
        </LoadingContainer>
      </DashboardWrapper>
    );
  }
  return (
    <DashboardWrapper>
      <Container>
        {/* Welcome Section */}
        <WelcomeCard
          as={motion.div}
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
                  ? `Ready to make more impact? You've rescued ${stats.itemsShared} items!`
                  : isRecipient
                  ? "Browse and claim items available for you to receive."
                  : "Discover items that need a second chance in your community"}
              </p>
            </WelcomeText>
            <QuickActions>
              {isDonor && (
                <>
                  <ActionBtn
                    as={motion.button}
                    $primary
                    onClick={handleUploadItem}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📸</span> Upload Item
                  </ActionBtn>
                  <ActionBtn
                    as={motion.button}
                    onClick={() => navigate("/schedules")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📅</span> Schedules
                  </ActionBtn>
                  <ActionBtn
                    as={motion.button}
                    onClick={() => navigate("/my-pickups")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📦</span> Pickups
                  </ActionBtn>
                </>
              )}
              {isRecipient && (
                <>
                  <ActionBtn
                    as={motion.button}
                    $primary
                    onClick={() => navigate("/listings")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🔍</span> Browse Items
                  </ActionBtn>
                  <ActionBtn
                    as={motion.button}
                    onClick={() => navigate("/schedules")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📅</span> My Schedules
                  </ActionBtn>
                  <ActionBtn
                    as={motion.button}
                    onClick={() => navigate("/my-pickups")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📦</span> My Pickups
                  </ActionBtn>
                </>
              )}
              <ActionBtn
                as={motion.button}
                onClick={handleBrowseItems}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔍</span> Browse
              </ActionBtn>
            </QuickActions>
          </WelcomeHeader>
        </WelcomeCard>
        {/* Quick Action Cards */}
        <QuickActionsGrid>
          {/* Schedules Card - For all users */}
          <QuickActionCard
            $gradient="#667eea, #764ba2"
            onClick={() => navigate("/schedules")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">📅</div>
            <div>
              <h3>My Schedules</h3>
              <p>View and manage pickup appointments</p>
            </div>
          </QuickActionCard>

          {/* Pickups Card - For all users */}
          <QuickActionCard
            $gradient="#f093fb, #f5576c"
            onClick={() => navigate("/my-pickups")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">📦</div>
            <div>
              <h3>My Pickups</h3>
              <p>
                {isDonor
                  ? "Track your donations"
                  : "Track items you're receiving"}
              </p>
            </div>
          </QuickActionCard>

          <QuickActionCard
            $gradient="#43e97b, #38f9d7"
            onClick={() => navigate("/waste-analyzer")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">🤖</div>
            <div>
              <h3>AI Analyzer</h3>
              <p>Get smart suggestions for your items</p>
            </div>
          </QuickActionCard>

          <QuickActionCard
            $gradient="#fa709a, #fee140"
            onClick={() => navigate("/impact/personal")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">🌟</div>
            <div>
              <h3>My Impact</h3>
              <p>View your environmental contribution</p>
            </div>
          </QuickActionCard>

          <QuickActionCard
            $gradient="#11998e, #38ef7d"
            onClick={() => navigate("/listings")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">🔍</div>
            <div>
              <h3>Discover</h3>
              <p>Find items in your area</p>
            </div>
          </QuickActionCard>

          <QuickActionCard
            $gradient="#ee0979, #ff6a00"
            onClick={() => navigate("/chat")}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="icon">💬</div>
            <div>
              <h3>Messages</h3>
              <p>Connect with the community</p>
            </div>
          </QuickActionCard>
        </QuickActionsGrid>

        {/* Stats Grid with Progress */}
        <StatsGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {isDonor && (
            <>
              <StatCard
                as={motion.div}
                variants={itemVariants}
                $color="linear-gradient(90deg, #667eea, #764ba2)"
                whileHover={{ y: -5 }}
              >
                <StatIcon>📸</StatIcon>
                <StatValue>{stats.itemsAnalyzed}</StatValue>
                <StatLabel>Items Uploaded</StatLabel>
              </StatCard>
              <StatCard
                as={motion.div}
                variants={itemVariants}
                $color="linear-gradient(90deg, #22c55e, #16a34a)"
                whileHover={{ y: -5 }}
              >
                <StatIcon>🔄</StatIcon>
                <StatValue>{stats.itemsShared}</StatValue>
                <StatLabel>Items Rescued</StatLabel>
              </StatCard>
              <StatCard
                as={motion.div}
                variants={itemVariants}
                $color="linear-gradient(90deg, #06b6d4, #0891b2)"
                whileHover={{ y: -5 }}
              >
                <StatIcon>🌍</StatIcon>
                <StatValue>{stats.co2Saved}kg</StatValue>
                <StatLabel>CO₂ Saved</StatLabel>
              </StatCard>
              <StatCard
                as={motion.div}
                variants={itemVariants}
                $color="linear-gradient(90deg, #f093fb, #f5576c)"
                whileHover={{ y: -5 }}
                style={{ cursor: "default" }}
              >
                <ProgressRing $progress={completionRate} $size="80px">
                  <div className="progress-value">{completionRate}%</div>
                </ProgressRing>
                <StatLabel style={{ marginTop: "1rem" }}>
                  Completion Rate
                </StatLabel>
              </StatCard>
            </>
          )}
          {isRecipient && (
            <>
              <StatCard
                as={motion.div}
                variants={itemVariants}
                $color="linear-gradient(90deg, #667eea, #764ba2)"
                whileHover={{ y: -5 }}
              >
                <StatIcon>📦</StatIcon>
                <StatValue>{stats.itemsShared}</StatValue>
                <StatLabel>Items Received</StatLabel>
              </StatCard>
            </>
          )}
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          <MainContent>
            {/* Recent Items */}
            <Card
              as={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardHeader>
                <h2>
                  <span>📦</span> Recent Items
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  {recentItems.length > 0 && (
                    <>
                      <motion.button
                        onClick={() => {
                          try {
                            exportDonationsToCSV(
                              recentItems,
                              `donations-${
                                new Date().toISOString().split("T")[0]
                              }`
                            );
                            toast.success("Donations exported to CSV!");
                          } catch (err) {
                            toast.error("Export failed");
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          background:
                            "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                          border: "none",
                          borderRadius: "6px",
                          padding: "0.4rem 0.8rem",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        title="Export to CSV"
                      >
                        📊 Export
                      </motion.button>
                      <ViewAllBtn
                        as={motion.button}
                        onClick={handleViewAllItems}
                        whileHover={{ scale: 1.05 }}
                      >
                        View All →
                      </ViewAllBtn>
                    </>
                  )}
                </div>
              </CardHeader>

              {recentItems.length > 0 ? (
                <ItemsList>
                  <AnimatePresence>
                    {recentItems.map((item, index) => (
                      <ItemCard
                        as={motion.div}
                        key={item._id}
                        $status={item.status}
                        onClick={() => handleViewItem(item)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
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
                  </AnimatePresence>
                </ItemsList>
              ) : (
                <EmptyState>
                  <div className="icon">📭</div>
                  <p>No items yet</p>
                  {isDonor ? (
                    <>
                      <p style={{ fontSize: "0.9rem", marginTop: "-1rem" }}>
                        Start your journey by uploading your first item
                      </p>
                      <ActionBtn
                        as={motion.button}
                        $primary
                        onClick={handleUploadItem}
                        whileHover={{ scale: 1.05 }}
                        style={{ marginTop: "1rem" }}
                      >
                        <span>📸</span> Upload First Item
                      </ActionBtn>
                    </>
                  ) : (
                    <p style={{ fontSize: "0.9rem", marginTop: "-1rem" }}>
                      Items you receive will appear here.
                    </p>
                  )}
                </EmptyState>
              )}
            </Card>

            {/* Achievement Badges (Donor only) */}
            {isDonor && stats.itemsAnalyzed > 0 && (
              <Card
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardHeader>
                  <h2>
                    <span>🏆</span> Achievements
                  </h2>
                </CardHeader>
                <BadgeContainer>
                  <Badge
                    as={motion.div}
                    $unlocked={stats.itemsShared >= 1}
                    $color="#22c55e"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="badge-icon">🌱</div>
                    <div className="badge-label">First Share</div>
                  </Badge>
                  <Badge
                    as={motion.div}
                    $unlocked={stats.itemsShared >= 5}
                    $color="#667eea"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="badge-icon">⭐</div>
                    <div className="badge-label">5 Shares</div>
                  </Badge>
                  <Badge
                    as={motion.div}
                    $unlocked={stats.itemsShared >= 10}
                    $color="#f59e0b"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="badge-icon">🏅</div>
                    <div className="badge-label">10 Shares</div>
                  </Badge>
                  <Badge
                    as={motion.div}
                    $unlocked={stats.co2Saved >= 100}
                    $color="#8b5cf6"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="badge-icon">🌍</div>
                    <div className="badge-label">Eco Warrior</div>
                  </Badge>
                  <Badge
                    as={motion.div}
                    $unlocked={stats.itemsShared >= 20}
                    $color="#ec4899"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="badge-icon">👑</div>
                    <div className="badge-label">Champion</div>
                  </Badge>
                </BadgeContainer>
              </Card>
            )}
          </MainContent>

          {/* Sidebar */}
          <Sidebar>
            {/* AI Insights (Donor only) */}
            {isDonor && aiInsights.length > 0 && (
              <Card
                as={motion.div}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardHeader>
                  <h2>
                    <span>💡</span> Insights
                  </h2>
                </CardHeader>

                <InsightsList>
                  {aiInsights.map((insight, index) => (
                    <InsightCard
                      as={motion.div}
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: 4 }}
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

            {/* Recent Activity Timeline */}
            {recentActivity.length > 0 && (
              <Card
                as={motion.div}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardHeader>
                  <h2>
                    <span>📅</span> Recent Activity
                  </h2>
                </CardHeader>

                <Timeline>
                  {recentActivity.map((activity, index) => (
                    <TimelineItem
                      as={motion.div}
                      key={index}
                      $icon={activity.icon}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <ItemName>{activity.title}</ItemName>
                      <ItemMeta>{activity.time}</ItemMeta>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Card>
            )}

            {/* Impact Summary */}
            <Card
              as={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                border: "2px solid var(--primary)",
              }}
            >
              <GradientHeader>Your Impact</GradientHeader>

              <InsightsList>
                <InsightCard
                  as={motion.div}
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    borderColor: "#22c55e",
                  }}
                  whileHover={{ x: 4 }}
                >
                  <InsightIcon>🌱</InsightIcon>
                  <InsightContent>
                    <h3>Trees Equivalent</h3>
                    <p>
                      Your efforts equal planting{" "}
                      <strong>{Math.round(stats.co2Saved / 13)}</strong> trees!
                    </p>
                  </InsightContent>
                </InsightCard>

                <InsightCard
                  as={motion.div}
                  style={{
                    background: "rgba(102, 126, 234, 0.15)",
                    borderColor: "#667eea",
                  }}
                  whileHover={{ x: 4 }}
                >
                  <InsightIcon>🤝</InsightIcon>
                  <InsightContent>
                    <h3>Community Hero</h3>
                    <p>
                      Helped <strong>{stats.itemsShared}</strong> people find
                      what they need
                    </p>
                  </InsightContent>
                </InsightCard>

                <InsightCard
                  as={motion.div}
                  style={{
                    background: "rgba(245, 158, 11, 0.15)",
                    borderColor: "#f59e0b",
                  }}
                  whileHover={{ x: 4 }}
                >
                  <InsightIcon>♻️</InsightIcon>
                  <InsightContent>
                    <h3>Waste Warrior</h3>
                    <p>
                      Prevented <strong>{stats.wastePrevented}kg</strong> from
                      landfills
                    </p>
                  </InsightContent>
                </InsightCard>
              </InsightsList>
            </Card>
          </Sidebar>
        </ContentGrid>
      </Container>

      {/* Floating Action Button (Donor only) */}
      {isDonor && (
        <FAB
          as={motion.button}
          onClick={handleUploadItem}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          title="Upload new item"
        >
          ➕
        </FAB>
      )}
    </DashboardWrapper>
  );
};
export default Dashboard;
