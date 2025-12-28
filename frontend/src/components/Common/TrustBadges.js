// src/components/TrustBadges/index.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

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
  ${(props) => {
    switch (props.$type) {
      case "verified_contributor":
        return `
          background: var(--gradient-success);
          color: var(--text-on-success);
        `;
      case "trusted_recipient":
        return `
          background: var(--gradient-info);
          color: var(--text-on-info);
        `;
      case "community_champion":
        return `
          background: var(--gradient-warning);
          color: var(--text-on-warning);
        `;
      case "power_donor":
        return `
          background: var(--gradient-primary);
          color: var(--text-on-primary);
        `;
      case "reliability_star":
        return `
          background: var(--gradient-yellow);
          color: var(--text-on-yellow);
        `;
      default:
        return `
          background: var(--badge-bg-default);
          color: var(--badge-text-default);
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
  background: var(--gradient-primary);
  color: var(--text-on-primary);
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
  background: var(--badge-bg-verified);
  color: var(--badge-text-verified);
  font-size: 0.8rem;
  font-weight: 600;
`;

const getBadgeInfo = (badgeType) => {
  const badges = {
    verified_contributor: {
      icon: "🌟",
      label: "Verified Contributor",
      tooltip: "Completed 5+ donations",
    },
    trusted_recipient: {
      icon: "🎯",
      label: "Trusted Recipient",
      tooltip: "Completed 5+ successful pickups",
    },
    community_champion: {
      icon: "🏆",
      label: "Community Champion",
      tooltip: "Outstanding community member",
    },
    power_donor: {
      icon: "💎",
      label: "Power Donor",
      tooltip: "Donated 20+ items",
    },
    early_adopter: {
      icon: "🚀",
      label: "Early Adopter",
      tooltip: "Joined in the first month",
    },
    reliability_star: {
      icon: "⭐",
      label: "Reliability Star",
      tooltip: "95%+ completion rate",
    },
  };

  return badges[badgeType] || { icon: "✨", label: badgeType, tooltip: "" };
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
      {showVerification &&
        (verificationStatus.email || verificationStatus.phone) && (
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
        <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          No badges yet
        </span>
      )}
    </BadgesContainer>
  );
};

export default TrustBadges;
