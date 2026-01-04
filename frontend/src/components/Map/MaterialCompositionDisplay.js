// src/components/MaterialCompositionDisplay.jsx - THEME INTEGRATED
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  background: var(--gradient-primary);
  border-radius: 24px;
  padding: 2rem;
  color: var(--text-on-primary);
  margin: 2rem 0;
  box-shadow: var(--shadow-card);
  border: 2px solid var(--primary);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
    margin: 1.5rem 0;
  }
`;

const Title = styled.h3`
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  color: var(--text-on-primary);

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const MaterialGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MaterialCard = styled.div`
  background: var(--bg-card);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid
    ${(props) =>
      props.$hazard === "high"
        ? "var(--danger)"
        : props.$hazard === "medium"
        ? "var(--warning)"
        : "var(--success)"};
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-card);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const MaterialInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .details {
    font-size: 0.95rem;
    color: var(--text-secondary);
    font-weight: 600;
  }
`;

const MaterialPercentage = styled.div`
  font-size: 2rem;
  font-weight: 900;
  text-align: right;
  color: var(--primary);
  background: var(--bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    width: 100%;
    text-align: center;
  }
`;

const HazardBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.9rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-left: 0.5rem;
  background: ${(props) =>
    props.$level === "high"
      ? "var(--danger)"
      : props.$level === "medium"
      ? "var(--warning)"
      : "transparent"};
  color: var(--text-on-primary);
  box-shadow: var(--shadow-sm);
`;

const ImpactStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 1.25rem;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--border);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-card);
  }

  .value {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    color: var(--primary);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .label {
    font-size: 0.95rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .value {
      font-size: 1.75rem;
    }
  }
`;

const RecommendationList = styled.div`
  margin-top: 2rem;

  h4 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    font-weight: 700;
    color: var(--text-on-primary);
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;

    h4 {
      font-size: 1.1rem;
    }
  }
`;

const RecommendationItem = styled.div`
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 1.25rem;
  border-radius: 16px;
  margin-bottom: 0.75rem;
  border-left: 4px solid
    ${(props) =>
      props.$priority === "CRITICAL"
        ? "var(--danger)"
        : props.$priority === "HIGH"
        ? "var(--warning)"
        : "var(--primary)"};
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-card);
  }

  .priority {
    font-weight: 700;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: ${(props) =>
      props.$priority === "CRITICAL"
        ? "var(--danger)"
        : props.$priority === "HIGH"
        ? "var(--warning)"
        : "var(--primary)"};
  }

  .action {
    font-size: 1rem;
    margin-bottom: 0.3rem;
    color: var(--text-primary);
    font-weight: 600;
  }

  .reason {
    font-size: 0.9rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .priority {
      font-size: 0.85rem;
    }

    .action {
      font-size: 0.95rem;
    }

    .reason {
      font-size: 0.85rem;
    }
  }
`;

const ComplexityBadge = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  color: var(--text-primary);
  border-radius: 12px;
  font-size: 0.95rem;
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);

  strong {
    color: var(--primary);
    font-weight: 700;
  }

  @media (max-width: 768px) {
    margin-top: 1.25rem;
    padding: 0.875rem 1rem;
    font-size: 0.9rem;
  }
`;

const MaterialCompositionDisplay = ({ analysis }) => {
  if (!analysis || !analysis.materialComposition) {
    return null;
  }

  const {
    materialComposition,
    recyclingComplexity,
    environmentalImpact,
    recyclingRecommendations,
    hazards,
  } = analysis;

  return (
    <Container
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
    >
      <Title>
        <span>🔬</span>
        <span>Material Composition Analysis</span>
      </Title>

      <MaterialGrid>
        {materialComposition.map((material, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 + index * 0.1 }}
          >
            <MaterialCard $hazard={material.hazard}>
              <MaterialInfo>
                <h4>
                  {material.name}
                  {material.hazard !== "low" && (
                    <HazardBadge $level={material.hazard}>
                      {material.hazard} hazard
                    </HazardBadge>
                  )}
                </h4>
                <div className="details">
                  {material.recyclable ? "♻️ Recyclable" : "⚠️ Not Recyclable"}
                </div>
              </MaterialInfo>
              <MaterialPercentage>{material.percentage}%</MaterialPercentage>
            </MaterialCard>
          </motion.div>
        ))}
      </MaterialGrid>

      {environmentalImpact && (
        <ImpactStats>
          <StatCard>
            <div className="value">
              {environmentalImpact.recyclablePercentage}%
            </div>
            <div className="label">Recyclable Content</div>
          </StatCard>
          <StatCard>
            <div className="value">
              {environmentalImpact.co2SavedByRecycling}kg
            </div>
            <div className="label">CO₂ Saved by Recycling</div>
          </StatCard>
          <StatCard>
            <div className="value">
              {environmentalImpact.landfillDiversionPotential}
            </div>
            <div className="label">Diversion Potential</div>
          </StatCard>
        </ImpactStats>
      )}

      {hazards && hazards.hasHazardousMaterials && (
        <RecommendationList>
          <h4>⚠️ Hazardous Materials Detected</h4>
          {hazards.criticalHazards.map((hazard, index) => (
            <RecommendationItem key={index} $priority="CRITICAL">
              <div className="priority">🚨 CRITICAL: {hazard.material}</div>
              <div className="action">{hazard.warning}</div>
              <div className="reason">Risk: {hazard.risk}</div>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}

      {recyclingRecommendations && recyclingRecommendations.length > 0 && (
        <RecommendationList>
          <h4>📋 Recycling Recommendations</h4>
          {recyclingRecommendations.slice(0, 3).map((rec, index) => (
            <RecommendationItem key={index} $priority={rec.priority}>
              <div className="priority">
                {rec.priority}: {rec.material}
              </div>
              <div className="action">{rec.action}</div>
              <div className="reason">{rec.reason}</div>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}

      <ComplexityBadge>
        <strong>Recycling Complexity:</strong> {recyclingComplexity}
      </ComplexityBadge>
    </Container>
  );
};

export default MaterialCompositionDisplay;
