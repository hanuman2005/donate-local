// src/components/ImpactDashboard/PersonalImpact.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImpactCard from './ImpactCard';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
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

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const RankCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const RankBadge = styled.div`
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

const MilestonesSection = styled.div`
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

const AchievementsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Achievement = styled.div`
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  color: #38a169;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NextMilestone = styled.div`
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

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
  border-radius: 10px;
  width: ${props => props.$progress}%;
  transition: width 1s ease-out;
`;

const RecentActivities = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #f7fafc;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
    background: #edf2f7;
  }
`;

const ActivityIcon = styled.div`
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 2rem;
  color: #667eea;
`;

const PersonalImpact = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = async () => {
    try {
      const token = localStorage.getItem('token');
      // ✅ fixed: removed duplicate /api from path
      const response = await api.get('/impact/personal', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load impact data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading your impact... 🌍</LoadingSpinner>;
  }

  if (!data) {
    return <Container>Error loading data</Container>;
  }

  const { impact, milestones, rank, recentActivities } = data;

  return (
    <Container>
      <Header>
        <Title>Your Environmental Impact 🌍</Title>
        <Subtitle>Making a difference, one donation at a time</Subtitle>
      </Header>

      <CardsGrid>
        <ImpactCard
          icon="♻️"
          value={impact.totalWastePreventedKg}
          label="Waste Prevented"
          subtitle="Kilograms saved from landfills"
          decimals={1}
          suffix=" kg"
          gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
        />

        <ImpactCard
          icon="🌍"
          value={impact.totalCO2SavedKg}
          label="CO2 Saved"
          subtitle={`Equivalent to ${impact.treesEquivalent} trees`}
          decimals={1}
          suffix=" kg"
          gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
        />

        <ImpactCard
          icon="🍽️"
          value={impact.totalMealsProvided}
          label="Meals Provided"
          subtitle="Feeding our community"
          gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
        />

        <ImpactCard
          icon="💧"
          value={impact.totalWaterSavedLiters}
          label="Water Saved"
          subtitle="Liters conserved"
          decimals={0}
          suffix=" L"
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        />
      </CardsGrid>

      <RankCard>
        <RankBadge>
          {rank.position <= 3 ? '🏆' : rank.position <= 10 ? '⭐' : '✨'}
        </RankBadge>
        <RankText>Rank #{rank.position}</RankText>
        <RankSubtext>out of {rank.total} community members</RankSubtext>
      </RankCard>

      {milestones && (
        <MilestonesSection>
          <MilestoneTitle>🎯 Your Achievements</MilestoneTitle>
          
          {milestones.achieved.length > 0 && (
            <AchievementsList>
              {milestones.achieved.map((achievement, index) => (
                <Achievement key={index}>{achievement}</Achievement>
              ))}
            </AchievementsList>
          )}

          {milestones.nextMilestone && (
            <NextMilestone>
              <div style={{ color: '#2d3748', fontWeight: 600, marginBottom: '0.5rem' }}>
                Next Milestone: {milestones.nextMilestone.message}
              </div>
              <div style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {milestones.nextMilestone.description}
              </div>
              <ProgressBar>
                <ProgressFill $progress={Math.min(milestones.nextMilestone.progress, 100)} />
              </ProgressBar>
              <div style={{ textAlign: 'right', marginTop: '0.5rem', color: '#4a5568', fontSize: '0.85rem' }}>
                {milestones.nextMilestone.progress.toFixed(0)}% Complete
              </div>
            </NextMilestone>
          )}
        </MilestonesSection>
      )}

      {recentActivities && recentActivities.length > 0 && (
        <RecentActivities>
          <MilestoneTitle>📋 Recent Activities</MilestoneTitle>
          {recentActivities.map((activity, index) => (
            <ActivityItem key={index}>
              <ActivityIcon>
                {activity.type === 'donated' ? '📤' : '📥'}
              </ActivityIcon>
              <ActivityDetails>
                <ActivityTitle>
                  {activity.type === 'donated' ? 'Donated' : 'Received'}: {activity.listing.title}
                </ActivityTitle>
                <ActivityDate>
                  {new Date(activity.completedAt).toLocaleDateString()} • 
                  Saved {activity.impact?.wastePreventedKg.toFixed(1)}kg waste
                </ActivityDate>
              </ActivityDetails>
            </ActivityItem>
          ))}
        </RecentActivities>
      )}
    </Container>
  );
};

export default PersonalImpact;
