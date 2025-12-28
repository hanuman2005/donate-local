// src/components/AIMatchSuggestions/index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { listingsAPI } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Container = styled(motion.div)`
  background: var(--gradient-primary);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  color: var(--text-on-primary);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
`;

const AIBadge = styled(motion.span)`
  background: var(--ai-badge-bg, rgba(255, 255, 255, 0.2));
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MatchCard = styled(motion.div)`
  background: var(--ai-matchcard-bg, rgba(255, 255, 255, 0.15));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid
    ${(props) =>
      props.$score >= 85
        ? "var(--success)"
        : props.$score >= 70
        ? "var(--primary)"
        : props.$score >= 55
        ? "var(--warning)"
        : "var(--border-color)"};
  transition: all 0.3s ease;

  &:hover {
    background: var(--ai-matchcard-hover-bg, rgba(255, 255, 255, 0.25));
    transform: translateX(8px);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid var(--bg-card);
  }

  div {
    h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }
`;

const ScoreBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--ai-scorebadge-bg, rgba(255, 255, 255, 0.2));
  padding: 0.75rem 1rem;
  border-radius: 12px;

  .score {
    font-size: 1.5rem;
    font-weight: 800;
  }

  .label {
    font-size: 0.75rem;
    opacity: 0.9;
  }
`;

const MatchFactors = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Factor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  span:first-child {
    font-size: 1.2rem;
  }
`;

const Recommendation = styled.p`
  font-size: 0.95rem;
  line-height: 1.5;
  opacity: 0.95;
  margin-bottom: 1rem;
  font-style: italic;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.$primary
      ? `
    background: var(--bg-card);
    color: var(--primary);
  `
      : `
    background: var(--ai-button-bg, rgba(255,255,255,0.2));
    color: var(--text-on-primary);
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  font-size: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  opacity: 0.9;

  div {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
`;

const AIMatchSuggestions = ({ listingId, onAssign }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, [listingId]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getMatchSuggestions(listingId);
      setMatches(response.data.matches || []);
    } catch (error) {
      console.error("Fetch matches error:", error);
      toast.error("Failed to load AI suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (recipientId, matchScore) => {
    if (!window.confirm("Assign this listing to the suggested recipient?"))
      return;

    setAssigning(recipientId);
    try {
      await listingsAPI.assign(listingId, {
        recipientId,
        message: "Assigned via AI",
      });
      toast.success(`✅ Assigned! Match score: ${matchScore}%`);
      if (onAssign) onAssign();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign");
    } finally {
      setAssigning(null);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleAutoAssign = async () => {
    if (!window.confirm("Auto-assign to the top AI match?")) return;

    try {
      const response = await listingsAPI.autoAssignTopMatch(listingId);

      toast.success(`🎯 Auto-assigned! Match: ${response.data.match.score}%`);
      if (onAssign) onAssign();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to auto-assign");
    }
  };

  if (loading) {
    return (
      <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          🤖 AI Analyzing...
        </LoadingSpinner>
      </Container>
    );
  }

  if (matches.length === 0) {
    return (
      <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <EmptyState>
          <div>🤖</div>
          <p>No suitable matches found yet. AI will keep analyzing!</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Header>
        <h3>🤖 AI Match Suggestions</h3>
        <AIBadge
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Powered by ML
        </AIBadge>
      </Header>

      <MatchList>
        <AnimatePresence>
          {matches.map((match, index) => (
            <MatchCard
              key={match.recipient._id}
              $score={match.score}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <MatchHeader>
                <UserInfo>
                  <img
                    src={
                      match.recipient.avatar ||
                      `https://ui-avatars.com/api/?name=${match.recipient.firstName}`
                    }
                    alt={match.recipient.firstName}
                  />
                  <div>
                    <h4>
                      {match.recipient.firstName} {match.recipient.lastName}
                    </h4>
                    <p>
                      ⭐{" "}
                      {match.recipient.rating?.average?.toFixed(1) ||
                        "New User"}
                      {match.recipient.badges?.includes("verified") &&
                        " • ✅ Verified"}
                    </p>
                  </div>
                </UserInfo>

                <ScoreBadge>
                  <div className="score">{match.score}%</div>
                  <div className="label">{match.confidence}</div>
                </ScoreBadge>
              </MatchHeader>

              <MatchFactors>
                <Factor>
                  <span>📍</span>
                  <span>{match.factors.proximity || 0} pts (Location)</span>
                </Factor>
                <Factor>
                  <span>✅</span>
                  <span>
                    {match.factors.completionRate || 0} pts (Reliability)
                  </span>
                </Factor>
                <Factor>
                  <span>⭐</span>
                  <span>{match.factors.rating || 0} pts (Rating)</span>
                </Factor>
                {match.factors.categoryMatch > 0 && (
                  <Factor>
                    <span>🎯</span>
                    <span>
                      {match.factors.categoryMatch} pts (Category Match)
                    </span>
                  </Factor>
                )}
              </MatchFactors>

              <Recommendation>💡 {match.recommendation}</Recommendation>

              <ActionButtons>
                <Button
                  onClick={() => handleViewProfile(match.recipient._id)}
                  disabled={assigning}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  👤 View Profile
                </Button>

                <Button
                  $primary
                  onClick={() => handleAssign(match.recipient)}
                  disabled={assigning !== null}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {assigning === match.recipient._id
                    ? "Assigning..."
                    : `✅ Assign (${match.score}%)`}
                </Button>
              </ActionButtons>
            </MatchCard>
          ))}
        </AnimatePresence>
      </MatchList>

      {matches.length > 0 && (
        <Button
          $primary
          onClick={handleAutoAssign}
          disabled={assigning !== null}
          style={{ width: "100%", marginTop: "1rem" }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          🎯 Auto-Assign to Top Match ({matches[0].score}%)
        </Button>
      )}
    </Container>
  );
};

export default AIMatchSuggestions;
