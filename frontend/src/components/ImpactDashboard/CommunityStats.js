// src/components/ImpactDashboard/CommunityStats.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImpactCard from './ImpactCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import api from '../../services/api'; // ✅ Added this line

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

const Section = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LeaderboardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  border-radius: 15px;
  background: ${props => props.$rank <= 3 ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : '#f7fafc'};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const RankBadge = styled.div`
  font-size: 2rem;
  font-weight: 800;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => {
    if (props.$rank === 1) return 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    if (props.$rank === 2) return 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)';
    if (props.$rank === 3) return 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)';
    return '#e2e8f0';
  }};
  color: ${props => props.$rank <= 3 ? '#2d3748' : '#718096'};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: #2d3748;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const UserStats = styled.div`
  color: #718096;
  font-size: 0.9rem;
`;

const TrendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const TrendingCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 1.5rem;
  color: white;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
`;

const CategoryName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
`;

const CategoryCount = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StatBox = styled.div`
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #718096;
  font-size: 0.95rem;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 2rem;
  color: #667eea;
`;

const getCategoryIcon = (category) => {
  const icons = {
    'fruits': '🍎',
    'vegetables': '🥬',
    'grains': '🌾',
    'dairy': '🥛',
    'meat': '🍖',
    'bakery': '🍞',
    'canned-goods': '🥫',
    'beverages': '🥤',
    'snacks': '🍿',
    'frozen': '❄️',
    'prepared-meals': '🍱',
    'clothing': '👕',
    'electronics': '📱',
    'furniture': '🛋️',
    'books': '📚',
    'toys': '🧸',
    'household': '🏠'
  };
  return icons[category] || '📦';
};

const CommunityStats = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      // ✅ Changed axios to api and fixed endpoint path
      const response = await api.get('/impact/community');
      
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner>Loading community impact... 🌍</LoadingSpinner>;
  }

  if (!data) {
    return <Container>Error loading data</Container>;
  }

  const { community, topDonors, trendingCategories, stats } = data;

  return (
    <Container>
      <Header>
        <Title>Community Impact 🌟</Title>
        <Subtitle>Together, we're making a difference</Subtitle>
      </Header>

      <CardsGrid>
        <ImpactCard
          icon="♻️"
          value={community.totalWastePreventedKg}
          label="Total Waste Prevented"
          subtitle="Community-wide impact"
          decimals={1}
          suffix=" kg"
          gradient="linear-gradient(135deg, #48bb78 0%, #38a169 100%)"
        />

        <ImpactCard
          icon="🌍"
          value={community.totalCO2SavedKg}
          label="Total CO2 Saved"
          subtitle={`${community.treesEquivalent} trees equivalent`}
          decimals={1}
          suffix=" kg"
          gradient="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)"
        />

        <ImpactCard
          icon="🍽️"
          value={community.totalMealsProvided}
          label="Total Meals"
          subtitle="Fed to community members"
          gradient="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)"
        />

        <ImpactCard
          icon="👥"
          value={community.totalUsers}
          label="Active Members"
          subtitle="Growing every day"
          gradient="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)"
        />
      </CardsGrid>

      <Section>
        <SectionTitle>🏆 Top Contributors</SectionTitle>
        <LeaderboardList>
          {topDonors.slice(0, 10).map((donor, index) => (
            <LeaderboardItem key={index} $rank={index + 1}>
              <RankBadge $rank={index + 1}>
                {index + 1 <= 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
              </RankBadge>
              <UserInfo>
                <UserName>
                  {donor.user ? `${donor.user.firstName} ${donor.user.lastName}` : 'Anonymous'}
                </UserName>
                <UserStats>
                  {donor.wasteKg.toFixed(1)}kg waste prevented • 
                  {donor.co2Kg.toFixed(1)}kg CO2 saved • 
                  {donor.count} donations
                </UserStats>
              </UserInfo>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </Section>

      {trendingCategories && trendingCategories.length > 0 && (
        <Section>
          <SectionTitle>🔥 Trending This Week</SectionTitle>
          <TrendingGrid>
            {trendingCategories.map((category, index) => (
              <TrendingCard key={index}>
                <CategoryIcon>{getCategoryIcon(category._id)}</CategoryIcon>
                <CategoryName>{category._id || 'Other'}</CategoryName>
                <CategoryCount>{category.count} donations</CategoryCount>
              </TrendingCard>
            ))}
          </TrendingGrid>
        </Section>
      )}

      <Section>
        <SectionTitle>📊 This Week's Activity</SectionTitle>
        <StatsRow>
          <StatBox>
            <StatValue>{stats.activeUsersThisWeek}</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{stats.transactionsThisWeek}</StatValue>
            <StatLabel>Transactions</StatLabel>
          </StatBox>
          <StatBox>
            <StatValue>{community.totalTransactions}</StatValue>
            <StatLabel>All-Time Total</StatLabel>
          </StatBox>
        </StatsRow>
      </Section>
    </Container>
  );
};

export default CommunityStats;