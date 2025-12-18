// ============================================
// src/components/ImpactDashboard/CommunityStats.jsx - THEME-AWARE VERSION
// ============================================
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionVariants } from "../../animations/motionVariants";
import ImpactCard from "./ImpactCard";
import { impactAPI } from "../../services/api";
import { toast } from "react-toastify";
import {
  Container,
  Header,
  Title,
  Subtitle,
  CardsGrid,
  Section,
  SectionTitle,
  LeaderboardList,
  LeaderboardItem,
  RankBadge,
  UserInfo,
  UserName,
  UserStats,
  TrendingGrid,
  TrendingCard,
  CategoryIcon,
  CategoryName,
  CategoryCount,
  StatsRow,
  StatBox,
  StatValue,
  StatLabel,
  LoadingSpinner,
  ErrorMessage,
} from "./styledComponents";

// All styled-components are now imported from styledComponents.js and use theme variables for perfect theme switching.

const getCategoryIcon = (category) => {
  const icons = {
    produce: "🍎",
    "canned-goods": "🥫",
    dairy: "🥛",
    bakery: "🍞",
    "household-items": "🏠",
    clothing: "👕",
    electronics: "📱",
    furniture: "🛋️",
    books: "📚",
    toys: "🧸",
    other: "📦",
  };
  return icons[category] || "📦";
};

const CommunityStats = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await impactAPI.getCommunityImpact();

      if (response.data.success) {
        setData(response.data);
      } else {
        throw new Error(
          response.data.message || "Failed to load community data"
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        error.response?.data?.message || "Failed to load community data"
      );
      toast.error("Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        variants={motionVariants.fadeSlide}
        initial="hidden"
        animate="show"
      >
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          Loading community impact... 🌍
        </LoadingSpinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        variants={motionVariants.fadeSlide}
        initial="hidden"
        animate="show"
      >
        <ErrorMessage variants={motionVariants.scaleIn}>
          {error}
          <br />
          <motion.button
            onClick={fetchCommunityData}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </ErrorMessage>
      </Container>
    );
  }

  if (!data || !data.community) {
    return (
      <Container>
        <ErrorMessage variants={motionVariants.fadeSlide}>
          No community data available
        </ErrorMessage>
      </Container>
    );
  }

  const { community, topDonors, trendingCategories, stats } = data;
  // Determine user type for display
  const userType = (
    window.localStorage.getItem("userType") || ""
  ).toLowerCase();
  const isDonor = userType === "donor" || userType === "both";
  const isRecipient = userType === "recipient";

  return (
    <Container
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <Header
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <Title>Community Impact 🌟</Title>
        <Subtitle>Together, we're making a difference</Subtitle>
      </Header>

      <CardsGrid
        variants={motionVariants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="♻️"
            value={community.totalWastePreventedKg || 0}
            label={isDonor ? "Total Waste Prevented" : "Total Waste Diverted"}
            subtitle={
              isDonor
                ? "Community-wide impact"
                : "Waste kept out of landfill by all"
            }
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
          />
        </motion.div>

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="🌍"
            value={community.totalCO2SavedKg || 0}
            label={isDonor ? "Total CO2 Saved" : "CO2 Offset"}
            subtitle={
              isDonor
                ? `${community.treesEquivalent || 0} trees equivalent`
                : "CO2 reduction by community"
            }
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
          />
        </motion.div>

        {isDonor && (
          <motion.div variants={motionVariants.scaleIn}>
            <ImpactCard
              icon="📦"
              value={
                community.totalItemsSaved || community.totalMealsProvided || 0
              }
              label="Items Shared"
              subtitle="Helping our community"
              gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
            />
          </motion.div>
        )}
        {isRecipient && (
          <motion.div variants={motionVariants.scaleIn}>
            <ImpactCard
              icon="📦"
              value={
                community.totalItemsReceived ||
                community.totalMealsProvided ||
                0
              }
              label="Items Received"
              subtitle="Support received by community"
              gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
            />
          </motion.div>
        )}

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="👥"
            value={stats?.activeUsersThisWeek || 0}
            label="Active This Week"
            subtitle="Growing every day"
            gradient="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
          />
        </motion.div>
      </CardsGrid>

      <AnimatePresence>
        {topDonors && topDonors.length > 0 && (
          <Section
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <SectionTitle>🏆 Top Contributors</SectionTitle>
            <LeaderboardList
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              {topDonors.slice(0, 10).map((donor, index) => (
                <LeaderboardItem
                  key={index}
                  $rank={index + 1}
                  variants={motionVariants.listItemSlideUp}
                  whileHover={{ x: 5, scale: 1.02 }}
                >
                  <RankBadge
                    $rank={index + 1}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {index + 1 <= 3
                      ? ["🥇", "🥈", "🥉"][index]
                      : `#${index + 1}`}
                  </RankBadge>
                  <UserInfo>
                    <UserName>
                      {donor.user
                        ? `${donor.user.firstName || ""} ${
                            donor.user.lastName || ""
                          }`.trim()
                        : "Anonymous"}
                    </UserName>
                    <UserStats>
                      {donor.wasteKg?.toFixed(1) || 0}kg waste prevented •
                      {donor.co2Kg?.toFixed(1) || 0}kg CO2 saved •
                      {donor.count || 0} donations
                    </UserStats>
                  </UserInfo>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </Section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {trendingCategories && trendingCategories.length > 0 && (
          <Section
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <SectionTitle>🔥 Trending This Week</SectionTitle>
            <TrendingGrid
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              {trendingCategories.map((category, index) => (
                <TrendingCard
                  key={index}
                  variants={motionVariants.scaleIn}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CategoryIcon
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {getCategoryIcon(category._id)}
                  </CategoryIcon>
                  <CategoryName>{category._id || "Other"}</CategoryName>
                  <CategoryCount>{category.count || 0} donations</CategoryCount>
                </TrendingCard>
              ))}
            </TrendingGrid>
          </Section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stats && (
          <Section
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <SectionTitle>📊 This Week's Activity</SectionTitle>
            <StatsRow
              variants={motionVariants.staggerContainerFast}
              initial="hidden"
              animate="show"
            >
              <StatBox
                variants={motionVariants.scaleIn}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <StatValue>{stats.activeUsersThisWeek || 0}</StatValue>
                <StatLabel>Active Users</StatLabel>
              </StatBox>
              <StatBox
                variants={motionVariants.scaleIn}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <StatValue>{stats.transactionsThisWeek || 0}</StatValue>
                <StatLabel>Transactions</StatLabel>
              </StatBox>
              <StatBox
                variants={motionVariants.scaleIn}
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <StatValue>{community.totalTransactions || 0}</StatValue>
                <StatLabel>All-Time Total</StatLabel>
              </StatBox>
            </StatsRow>
          </Section>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default CommunityStats;
