// ============================================
// src/components/ImpactDashboard/PersonalImpact.jsx - THEME-AWARE VERSION
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
  RankCard,
  RankBadge,
  RankText,
  RankSubtext,
  MilestonesSection,
  MilestoneTitle,
  AchievementsList,
  Achievement,
  NextMilestone,
  ProgressBar,
  ProgressFill,
  RecentActivities,
  ActivityItem,
  ActivityIcon,
  ActivityDetails,
  ActivityTitle,
  ActivityDate,
  LoadingSpinner,
  ErrorMessage,
} from "./styledComponents";

// All styled-components are now imported from styledComponents.js and use theme variables for perfect theme switching.

const PersonalImpact = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await impactAPI.getPersonalImpact();

      if (response.data.success) {
        setData(response.data);
      } else {
        throw new Error(response.data.message || "Failed to load impact data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.response?.data?.message || "Failed to load impact data");
      toast.error("Failed to load your impact data");
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
          Loading your impact... 🌍
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
            onClick={fetchImpactData}
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

  if (!data || !data.impact) {
    return (
      <Container>
        <ErrorMessage variants={motionVariants.fadeSlide}>
          No impact data available
        </ErrorMessage>
      </Container>
    );
  }

  const { impact, milestones, rank, recentActivities } = data;

  // Determine user type for impact display
  const userType =
    data?.userType ||
    (window.localStorage.getItem("userType") || "").toLowerCase();
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
        <Title>Your Environmental Impact 🌍</Title>
        <Subtitle>
          {isDonor
            ? "Making a difference, one donation at a time"
            : isRecipient
            ? "See your positive impact from items received!"
            : "Making a difference in your community"}
        </Subtitle>
      </Header>

      <CardsGrid
        variants={motionVariants.staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="♻️"
            value={impact.totalWastePreventedKg || 0}
            label={isDonor ? "Waste Prevented" : "Waste Diverted"}
            subtitle={
              isDonor
                ? "Kilograms saved from landfills"
                : "Waste kept out of landfill"
            }
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
          />
        </motion.div>

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="🌍"
            value={impact.totalCO2SavedKg || 0}
            label={isDonor ? "CO2 Saved" : "CO2 Offset"}
            subtitle={
              isDonor
                ? `Equivalent to ${impact.treesEquivalent || 0} trees`
                : "Your share of CO2 reduction"
            }
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
          />
        </motion.div>

        {isDonor && (
          <motion.div variants={motionVariants.scaleIn}>
            <ImpactCard
              icon="🍽️"
              value={impact.totalMealsProvided || 0}
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
                impact.totalItemsReceived || impact.totalMealsProvided || 0
              }
              label="Items Received"
              subtitle="Support you've received"
              gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
            />
          </motion.div>
        )}

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="💧"
            value={impact.totalWaterSavedLiters || 0}
            label="Water Saved"
            subtitle="Liters conserved"
            decimals={0}
            suffix=" L"
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </motion.div>
      </CardsGrid>

      <AnimatePresence>
        {rank && (
          <RankCard
            variants={motionVariants.scalePop}
            initial="hidden"
            animate="show"
            exit="exit"
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <RankBadge
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {rank.position <= 3 ? "🏆" : rank.position <= 10 ? "⭐" : "✨"}
            </RankBadge>
            <RankText>Rank #{rank.position || "N/A"}</RankText>
            <RankSubtext>
              out of {rank.total || 0} community members
            </RankSubtext>
          </RankCard>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {milestones && (
          <MilestonesSection
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <MilestoneTitle>🎯 Your Achievements</MilestoneTitle>

            {milestones.achieved && milestones.achieved.length > 0 && (
              <AchievementsList
                variants={motionVariants.staggerContainerFast}
                initial="hidden"
                animate="show"
              >
                {milestones.achieved.map((achievement, index) => (
                  <Achievement
                    key={index}
                    variants={motionVariants.scaleIn}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {achievement}
                  </Achievement>
                ))}
              </AchievementsList>
            )}

            {milestones.nextMilestone && (
              <NextMilestone variants={motionVariants.fadeSlideUp}>
                <div
                  style={{
                    color: "#2d3748",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  Next Milestone: {milestones.nextMilestone.message}
                </div>
                <div
                  style={{
                    color: "#718096",
                    fontSize: "0.9rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {milestones.nextMilestone.description}
                </div>
                <ProgressBar>
                  <ProgressFill
                    $progress={Math.min(
                      milestones.nextMilestone.progress || 0,
                      100
                    )}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        milestones.nextMilestone.progress || 0,
                        100
                      )}%`,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </ProgressBar>
                <div
                  style={{
                    textAlign: "right",
                    marginTop: "0.5rem",
                    color: "#4a5568",
                    fontSize: "0.85rem",
                  }}
                >
                  {(milestones.nextMilestone.progress || 0).toFixed(0)}%
                  Complete
                </div>
              </NextMilestone>
            )}
          </MilestonesSection>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {recentActivities && recentActivities.length > 0 && (
          <RecentActivities
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <MilestoneTitle>📋 Recent Activities</MilestoneTitle>
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                variants={motionVariants.listItemSlideUp}
                initial="hidden"
                animate="show"
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5, backgroundColor: "#edf2f7" }}
              >
                <ActivityIcon
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                >
                  {activity.type === "donated" ? "📤" : "📥"}
                </ActivityIcon>
                <ActivityDetails>
                  <ActivityTitle>
                    {activity.type === "donated" ? "Donated" : "Received"}:{" "}
                    {activity.listing?.title || "Item"}
                  </ActivityTitle>
                  <ActivityDate>
                    {new Date(activity.completedAt).toLocaleDateString()} •
                    Saved {activity.impact?.wastePreventedKg?.toFixed(1) || 0}kg
                    waste
                  </ActivityDate>
                </ActivityDetails>
              </ActivityItem>
            ))}
          </RecentActivities>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default PersonalImpact;
