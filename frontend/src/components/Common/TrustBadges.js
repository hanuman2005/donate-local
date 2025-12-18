// src/components/TrustBadges/index.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const Badge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: help;
  ${props => {
    switch (props.$type) {
      case 'verified_contributor':
        return `
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        `;
      case 'trusted_recipient':
        return `
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
        `;
      case 'community_champion':
        return `
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
        `;
      case 'power_donor':
        return `
          background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
          color: white;
        `;
      case 'reliability_star':
        return `
          background: linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%);
          color: #744210;
        `;
      default:
        return `
          background: #e2e8f0;
          color: #4a5568;
        `;
    }
  }}
`;

const TrustScore = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  
  .score {
    font-size: 1.1rem;
  }
`;

const VerificationBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  background: #d1fae5;
  color: #065f46;
  font-size: 0.8rem;
  font-weight: 600;
`;

const getBadgeInfo = (badgeType) => {
  const badges = {
    verified_contributor: {
      icon: '🌟',
      label: 'Verified Contributor',
      tooltip: 'Completed 5+ donations',
    },
    trusted_recipient: {
      icon: '🎯',
      label: 'Trusted Recipient',
      tooltip: 'Completed 5+ successful pickups',
    },
    community_champion: {
      icon: '🏆',
      label: 'Community Champion',
      tooltip: 'Outstanding community member',
    },
    power_donor: {
      icon: '💎',
      label: 'Power Donor',
      tooltip: 'Donated 20+ items',
    },
    early_adopter: {
      icon: '🚀',
      label: 'Early Adopter',
      tooltip: 'Joined in the first month',
    },
    reliability_star: {
      icon: '⭐',
      label: 'Reliability Star',
      tooltip: '95%+ completion rate',
    },
  };

  return badges[badgeType] || { icon: '✨', label: badgeType, tooltip: '' };
};

const TrustBadges = ({ user, showScore = true, showVerification = true }) => {
  const trustBadges = user.trustBadges || [];
  const trustScore = user.trustScore || 50;
  const verificationStatus = user.verificationStatus || {};

  return (
    <BadgesContainer>
      {/* Trust Score */}
      {showScore && trustScore > 0 && (
        <TrustScore
          title={`Trust Score: ${trustScore}/100`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🛡️ <span className="score">{trustScore}</span>
        </TrustScore>
      )}

      {/* Verification Badge */}
      {showVerification && (verificationStatus.email || verificationStatus.phone) && (
        <VerificationBadge
          title="Email/Phone Verified"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✅ Verified
        </VerificationBadge>
      )}

      {/* Trust Badges */}
      {trustBadges.map((badge, index) => {
        const badgeInfo = getBadgeInfo(badge.badge);
        return (
          <Badge
            key={index}
            $type={badge.badge}
            title={badgeInfo.tooltip}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{badgeInfo.icon}</span>
            <span>{badgeInfo.label}</span>
          </Badge>
        );
      })}

      {/* If no badges */}
      {trustBadges.length === 0 && !showScore && (
        <span style={{ color: '#a0aec0', fontSize: '0.85rem' }}>
          No badges yet
        </span>
      )}
    </BadgesContainer>
  );
};

export default TrustBadges;