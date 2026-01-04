// src/components/AIWasteAnalyzer/NearbyCentersSection.jsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  fetchNearbyCenters,
  getUserLocation,
  getMaterialIcon,
} from '../../utils/recyclingCenters';

// =====================
// Animations
// =====================
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// =====================
// Styled Components
// =====================
const Section = styled(motion.div)`
  background: var(--bg-card);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-card);
  border: 2px solid var(--border);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
    margin-bottom: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
`;

const SectionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: var(--shadow-button);
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const CentersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const CenterCard = styled(motion.div)`
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border-left: 4px solid var(--primary);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    transform: translateX(5px);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const CenterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CenterInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const CenterName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const CenterDistance = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card);
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
`;

const NavigateButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: var(--shadow-button);
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  
  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  p {
    font-size: 1.05rem;
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    
    .icon {
      font-size: 3rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
`;

const ErrorState = styled.div`
  background: var(--bg-warning, #FEF3C7);
  border-left: 4px solid var(--warning);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: start;
  
  .icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    
    p {
      color: var(--text-primary);
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }
    
    button {
      background: var(--bg-card);
      color: var(--warning);
      border: 2px solid var(--warning);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--warning);
        color: var(--text-on-primary);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    
    .icon {
      font-size: 1.5rem;
    }
    
    .content p {
      font-size: 0.9rem;
    }
  }
`;

const MaterialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
`;

// =====================
// Component
// =====================
const NearbyCentersSection = ({ material }) => {
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (material) {
      loadNearbyCenters();
    }
  }, [material]);

  const loadNearbyCenters = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user location
      toast.info('🗺️ Getting your location...');
      const location = await getUserLocation();
      setUserLocation(location);

      // Fetch centers
      const nearbyCenters = await fetchNearbyCenters(material, location);
      setCenters(nearbyCenters);

      if (nearbyCenters.length > 0) {
        toast.success(`📍 Found ${nearbyCenters.length} recycling centers nearby!`);
      }
    } catch (err) {
      console.error('Error loading centers:', err);
      
      if (err.code === 1) {
        // Permission denied
        setError('Location access denied. Please enable location services to find nearby centers.');
      } else if (err.code === 2) {
        // Position unavailable
        setError('Unable to determine your location. Please check your device settings.');
      } else if (err.code === 3) {
        // Timeout
        setError('Location request timed out. Please try again.');
      } else {
        setError('Failed to load recycling centers. Please try again.');
      }
      
      toast.error('Could not load recycling centers');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadNearbyCenters();
  };

  return (
    <Section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <SectionHeader>
        <SectionIcon>📍</SectionIcon>
        <SectionTitle>Nearby Recycling Centers</SectionTitle>
      </SectionHeader>

      <MaterialBadge>
        <span>{getMaterialIcon(material)}</span>
        <span>Showing centers for {material}</span>
      </MaterialBadge>

      {/* Loading State */}
      {loading && (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Finding recycling centers near you...</LoadingText>
        </LoadingContainer>
      )}

      {/* Error State */}
      {!loading && error && (
        <ErrorState>
          <div className="icon">⚠️</div>
          <div className="content">
            <p>{error}</p>
            <button onClick={handleRetry}>🔄 Try Again</button>
          </div>
        </ErrorState>
      )}

      {/* Empty State */}
      {!loading && !error && centers.length === 0 && (
        <EmptyState>
          <div className="icon">🔍</div>
          <p>
            No recycling centers found nearby.
            <br />
            Try expanding your search area or check local waste management services.
          </p>
        </EmptyState>
      )}

      {/* Centers List */}
      {!loading && !error && centers.length > 0 && (
        <CentersGrid>
          <AnimatePresence>
            {centers.map((center, index) => (
              <CenterCard
                key={center.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <CenterHeader>
                  <CenterInfo>
                    <CenterName>{center.name}</CenterName>
                    <CenterDistance>
                      <span>📏</span>
                      <span>{center.distanceText} away</span>
                    </CenterDistance>
                  </CenterInfo>
                </CenterHeader>

                <NavigateButton
                  href={center.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🚗</span>
                  <span>Navigate</span>
                </NavigateButton>
              </CenterCard>
            ))}
          </AnimatePresence>
        </CentersGrid>
      )}
    </Section>
  );
};

export default NearbyCentersSection;