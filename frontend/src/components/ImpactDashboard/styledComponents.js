import styled from "styled-components";
import { motion } from "framer-motion";

export const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
`;

export const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const Title = styled.h1`
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 800;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
    font-size: 2rem;
  }
`;

export const Subtitle = styled.p`
  color: var(--text-secondary);
  font-size: 1.2rem;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const CardsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

export const Section = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
  color: var(--text-primary);
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

export const LeaderboardList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LeaderboardItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 15px;
  background: ${(props) =>
    props.$rank <= 3
      ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)"
      : "var(--bg-secondary)"};
`;

export const RankBadge = styled(motion.div)`
  font-size: 2rem;
  font-weight: 800;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(props) => {
    if (props.$rank === 1)
      return "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)";
    if (props.$rank === 2)
      return "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)";
    if (props.$rank === 3)
      return "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)";
    return "var(--bg-secondary)";
  }};
  color: ${(props) =>
    props.$rank <= 3 ? "var(--text-primary)" : "var(--text-secondary)"};
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.div`
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

export const UserStats = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const TrendingGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

export const TrendingCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 1.5rem;
  color: white;
  text-align: center;
`;

export const CategoryIcon = styled(motion.div)`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

export const CategoryName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`;

export const CategoryCount = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const StatsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

export const StatBox = styled(motion.div)`
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

export const RankCard = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  text-align: center;
  margin-bottom: 2rem;
`;

export const RankText = styled.div`
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const RankSubtext = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
`;

export const MilestonesSection = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const MilestoneTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

export const AchievementsList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const Achievement = styled(motion.div)`
  background: var(--bg-secondary);
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  color: var(--success, #38a169);
  box-shadow: var(--shadow-sm);
`;

export const NextMilestone = styled(motion.div)`
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 0.75rem;
`;

export const ProgressFill = styled(motion.div)`
  height: 100%;
  background: var(
    --success-gradient,
    linear-gradient(90deg, #48bb78 0%, #38a169 100%)
  );
  border-radius: 10px;
  width: ${(props) => props.$progress}%;
`;

export const RecentActivities = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
`;

export const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: var(--bg-secondary);
`;

export const ActivityIcon = styled(motion.div)`
  font-size: 2rem;
  flex-shrink: 0;
`;

export const ActivityDetails = styled.div`
  flex: 1;
`;

export const ActivityTitle = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const ActivityDate = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

export const LoadingSpinner = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  font-size: 2rem;
  color: var(--primary);
`;

export const ErrorMessage = styled(motion.div)`
  text-align: center;
  padding: 4rem;
  color: var(--danger, #e53e3e);
  font-size: 1.2rem;
`;
