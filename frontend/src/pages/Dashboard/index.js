// src/pages/Dashboard/index.js - Updated with new color scheme
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api";
import { exportDonationsToCSV } from "../../utils/exportUtils";

import {
  DashboardWrapper,
  Container,
  HeroCard,
  HeroContent,
  HeroText,
  PrimaryButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  ProgressRing,
  ContentGrid,
  GlassCard,
  CardHeader,
  ViewAllButton,
  ItemsList,
  ItemCard,
  ItemIcon,
  ItemInfo,
  ItemName,
  ItemMeta,
  StatusBadge,
  ImpactCard,
  ImpactIcon,
  ImpactContent,
  QuickLinksGrid,
  QuickLinkButton,
  FAB,
  EmptyState,
  LoadingContainer,
  ExportButton,
} from "./styledComponents";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";

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

  const isDonor = user?.userType === "donor" || user?.userType === "both";
  const isRecipient = user?.userType === "recipient";

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const listingsResponse = await listingsAPI.getUserListings();
      const listings =
        listingsResponse.data.listings || listingsResponse.data.data || [];

      const completed = listings.filter((l) => l.status === "completed").length;
      const totalWeight = listings.reduce(
        (sum, listing) => sum + (listing.quantity || 1) * 2,
        0
      );

      setStats({
        itemsAnalyzed: listings.length,
        itemsShared: completed,
        co2Saved: Math.round(totalWeight * 1.5),
        wastePrevented: totalWeight,
      });

      setRecentItems(listings.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        itemsAnalyzed: 0,
        itemsShared: 0,
        co2Saved: 0,
        wastePrevented: 0,
      });
      setRecentItems([]);
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
    const diffDays = Math.floor((now - date) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const completionRate =
    stats.itemsAnalyzed > 0
      ? Math.round((stats.itemsShared / stats.itemsAnalyzed) * 100)
      : 0;

  if (loading) {
    return (
      <DashboardWrapper>
        <LoadingContainer>
          <LoadingSkeleton width="100%" height="8rem" />
          <p>Loading your dashboard...</p>
        </LoadingContainer>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <Container>
        {/* Hero Section */}
        <HeroCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroContent>
            <HeroText>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getGreeting()}, {user?.firstName}! 👋
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isDonor
                  ? `You've rescued ${stats.itemsShared} items and saved ${stats.co2Saved}kg CO₂. Keep up the amazing work!`
                  : isRecipient
                  ? "Browse and claim items available for you to receive."
                  : "Discover items that need a second chance in your community"}
              </motion.p>
            </HeroText>

            <PrimaryButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                isDonor ? navigate("/create-listing") : navigate("/listings")
              }
            >
              <span>📸</span>
              {isDonor ? "Upload Item" : "Browse Items"}
            </PrimaryButton>
          </HeroContent>
        </HeroCard>

        {/* Quick Links - Now Below Hero Section */}
        <QuickLinksGrid
          style={{ marginBottom: "1rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuickLinkButton
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/waste-analyzer")}
          >
            <span>🤖</span>
            AI Analyzer
          </QuickLinkButton>

          <QuickLinkButton
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/schedules")}
          >
            <span>📅</span>
            Schedules
          </QuickLinkButton>

          <QuickLinkButton
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chat")}
          >
            <span>💬</span>
            Messages
          </QuickLinkButton>

          <QuickLinkButton
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/create-listing")}
          >
            <span>📸</span>
            Create Listing
          </QuickLinkButton>
        </QuickLinksGrid>

        {/* Stats Grid */}
        <StatsGrid
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {isDonor && (
            <>
              {/* Items Uploaded */}
              <StatCard
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
                $color="#1B3C53"
              >
                <StatIcon>📦</StatIcon>
                <StatValue
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {stats.itemsAnalyzed}
                </StatValue>
                <StatLabel>Items Uploaded</StatLabel>
              </StatCard>

              {/* Items Rescued */}
              <StatCard
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
                $color="#234C6A"
              >
                <StatIcon>✅</StatIcon>
                <StatValue
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {stats.itemsShared}
                </StatValue>
                <StatLabel>Items Rescued</StatLabel>
              </StatCard>

              {/* CO₂ Saved */}
              <StatCard
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
                $color="#456882"
              >
                <StatIcon>🌍</StatIcon>
                <StatValue
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {stats.co2Saved}kg
                </StatValue>
                <StatLabel>CO₂ Saved</StatLabel>
              </StatCard>

              {/* Completion Rate */}
              <StatCard
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
                $color="#10b981"
                style={{ cursor: "default" }}
              >
                <StatIcon>🎯</StatIcon>
                <ProgressRing>
                  <svg width="80" height="80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="var(--border-color)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke="#234C6A"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 226" }}
                      animate={{
                        strokeDasharray: `${(completionRate / 100) * 226} 226`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="progress-value">{completionRate}%</div>
                </ProgressRing>
                <StatLabel style={{ marginTop: "1rem" }}>
                  Completion Rate
                </StatLabel>
              </StatCard>
            </>
          )}

          {isRecipient && (
            <StatCard
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -5 }}
              $color="#234C6A"
            >
              <StatIcon>📦</StatIcon>
              <StatValue
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                {stats.itemsShared}
              </StatValue>
              <StatLabel>Items Received</StatLabel>
            </StatCard>
          )}
        </StatsGrid>

        {/* Main Content Grid */}
        <ContentGrid>
          {/* Recent Items - Full Width */}
          <GlassCard
            $fullWidth
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardHeader>
              <h2>
                <span>📦</span> Recent Items
              </h2>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {recentItems.length > 0 && (
                  <>
                    <ExportButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        try {
                          exportDonationsToCSV(
                            recentItems,
                            `donations-${
                              new Date().toISOString().split("T")[0]
                            }`
                          );
                          toast.success("Exported to CSV!");
                        } catch (err) {
                          toast.error("Export failed");
                        }
                      }}
                    >
                      📊 Export
                    </ExportButton>
                    <ViewAllButton
                      whileHover={{ scale: 1.05 }}
                      onClick={() => navigate("/my-items")}
                    >
                      View All →
                    </ViewAllButton>
                  </>
                )}
              </div>
            </CardHeader>

            {recentItems.length > 0 ? (
              <ItemsList>
                {recentItems.map((item, index) => (
                  <ItemCard
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/listings/${item._id}`)}
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
                        <span>📂 {item.category || "General"}</span>
                        <span>•</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </ItemMeta>
                    </ItemInfo>
                    <StatusBadge $status={item.status}>
                      {item.status}
                    </StatusBadge>
                  </ItemCard>
                ))}
              </ItemsList>
            ) : (
              <EmptyState>
                <div className="icon">📭</div>
                <p>No items yet</p>
                <p style={{ fontSize: "0.9rem", marginTop: "-0.5rem" }}>
                  {isDonor
                    ? "Start your journey by uploading your first item"
                    : "Items you receive will appear here"}
                </p>
                {isDonor && (
                  <PrimaryButton
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/create-listing")}
                    style={{ marginTop: "1rem" }}
                  >
                    <span>📸</span> Upload First Item
                  </PrimaryButton>
                )}
              </EmptyState>
            )}
          </GlassCard>

          {/* Impact Summary - Sidebar */}
          <GlassCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CardHeader>
              <h2>
                <span>🌟</span> Your Impact
              </h2>
            </CardHeader>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <ImpactCard
                $color="#10b981"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <ImpactIcon>🌱</ImpactIcon>
                <ImpactContent>
                  <div className="impact-label">Trees Equivalent</div>
                  <div className="impact-value">
                    {Math.round(stats.co2Saved / 13)}
                  </div>
                </ImpactContent>
              </ImpactCard>

              <ImpactCard
                $color="#234C6A"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <ImpactIcon>♻️</ImpactIcon>
                <ImpactContent>
                  <div className="impact-label">Waste Prevented</div>
                  <div className="impact-value">{stats.wastePrevented}kg</div>
                </ImpactContent>
              </ImpactCard>

              <ImpactCard
                $color="#456882"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <ImpactIcon>🤝</ImpactIcon>
                <ImpactContent>
                  <div className="impact-label">People Helped</div>
                  <div className="impact-value">{stats.itemsShared}</div>
                </ImpactContent>
              </ImpactCard>
            </div>
          </GlassCard>
        </ContentGrid>
      </Container>

      {/* Floating Action Button */}
      {isDonor && (
        <FAB
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/create-listing")}
          title="Upload new item"
        >
          ➕
        </FAB>
      )}
    </DashboardWrapper>
  );
};

export default Dashboard;
