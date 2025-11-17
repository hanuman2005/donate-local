// ============================================
// src/components/ImpactDashboard/PersonalImpact.jsx - WITH MOTION
// ============================================
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { motionVariants } from "../../animations/motionVariants";
import ImpactCard from "./ImpactCard";
import { impactAPI } from "../../services/api";
import { toast } from "react-toastify";

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: #f7fafc;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  color: #718096;
  font-size: 1.2rem;
`;

const CardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const RankCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 2rem;
`;

const RankBadge = styled(motion.div)`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const RankText = styled.div`
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const RankSubtext = styled.div`
  color: #a0aec0;
  font-size: 1rem;
`;

const MilestonesSection = styled(motion.div)`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const MilestoneTitle = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const AchievementsList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Achievement = styled(motion.div)`
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  color: #38a169;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NextMilestone = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 0.75rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  border-radius: 10px;
  width: ${(props) => props.$progress}%;
`;

const RecentActivities = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #f7fafc;
`;

const ActivityIcon = styled(motion.div)`
  font-size: 2rem;
  flex-shrink: 0;
`;

const ActivityDetails = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ActivityDate = styled.div`
  color: #a0aec0;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  font-size: 2rem;
  color: #667eea;
`;

const ErrorMessage = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  color: #e53e3e;
  font-size: 1.2rem;
`;

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
        <Subtitle>Making a difference, one donation at a time</Subtitle>
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
            label="Waste Prevented"
            subtitle="Kilograms saved from landfills"
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
          />
        </motion.div>

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="🌍"
            value={impact.totalCO2SavedKg || 0}
            label="CO2 Saved"
            subtitle={`Equivalent to ${impact.treesEquivalent || 0} trees`}
            decimals={1}
            suffix=" kg"
            gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
          />
        </motion.div>

        <motion.div variants={motionVariants.scaleIn}>
          <ImpactCard
            icon="🍽️"
            value={impact.totalMealsProvided || 0}
            label="Items Shared"
            subtitle="Helping our community"
            gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
          />
        </motion.div>

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
