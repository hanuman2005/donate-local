// src/components/MaterialCompositionDisplay.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 2rem;
  color: white;
  margin: 2rem 0;
`;

const Title = styled.h3`
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MaterialGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MaterialCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${props => 
    props.$hazard === 'high' ? '#EF4444' : 
    props.$hazard === 'medium' ? '#F59E0B' : '#10B981'
  };
`;

const MaterialInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 700;
  }
  
  .details {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const MaterialPercentage = styled.div`
  font-size: 2rem;
  font-weight: 900;
  text-align: right;
`;

const HazardBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-left: 0.5rem;
  background: ${props => 
    props.$level === 'high' ? '#EF4444' : 
    props.$level === 'medium' ? '#F59E0B' : 'transparent'
  };
`;

const ImpactStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  
  .value {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const RecommendationList = styled.div`
  margin-top: 2rem;
  
  h4 {
    font-size: 1.2rem;
    margin: 0 0 1rem 0;
  }
`;

const RecommendationItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border-left: 4px solid ${props =>
    props.$priority === 'CRITICAL' ? '#EF4444' :
    props.$priority === 'HIGH' ? '#F59E0B' : '#3B82F6'
  };
  
  .priority {
    font-weight: 700;
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
    color: ${props =>
      props.$priority === 'CRITICAL' ? '#FEE2E2' :
      props.$priority === 'HIGH' ? '#FEF3C7' : '#DBEAFE'
    };
  }
  
  .action {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }
  
  .reason {
    font-size: 0.85rem;
    opacity: 0.8;
  }
`;

const MaterialCompositionDisplay = ({ analysis }) => {
  if (!analysis || !analysis.materialComposition) {
    return null;
  }

  const { materialComposition, recyclingComplexity, environmentalImpact, recyclingRecommendations, hazards } = analysis;

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
                  {material.hazard !== 'low' && (
                    <HazardBadge $level={material.hazard}>
                      {material.hazard} hazard
                    </HazardBadge>
                  )}
                </h4>
                <div className="details">
                  {material.recyclable ? '♻️ Recyclable' : '⚠️ Not Recyclable'}
                </div>
              </MaterialInfo>
              <MaterialPercentage>
                {material.percentage}%
              </MaterialPercentage>
            </MaterialCard>
          </motion.div>
        ))}
      </MaterialGrid>

      {environmentalImpact && (
        <ImpactStats>
          <StatCard>
            <div className="value">{environmentalImpact.recyclablePercentage}%</div>
            <div className="label">Recyclable Content</div>
          </StatCard>
          <StatCard>
            <div className="value">{environmentalImpact.co2SavedByRecycling}kg</div>
            <div className="label">CO₂ Saved by Recycling</div>
          </StatCard>
          <StatCard>
            <div className="value">{environmentalImpact.landfillDiversionPotential}</div>
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
              <div className="priority">{rec.priority}: {rec.material}</div>
              <div className="action">{rec.action}</div>
              <div className="reason">{rec.reason}</div>
            </RecommendationItem>
          ))}
        </RecommendationList>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
        <strong>Recycling Complexity:</strong> {recyclingComplexity}
      </div>
    </Container>
  );
};

export default MaterialCompositionDisplay;