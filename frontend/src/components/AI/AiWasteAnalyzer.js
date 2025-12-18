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
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// =====================
// Styled Components
// =====================
const Section = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f9ff;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f9ff;
`;

const SectionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
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
  border: 4px solid #e2e8f0;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
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
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  border-left: 4px solid #3B82F6;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  }
`;

const CenterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
`;

const CenterInfo = styled.div`
  flex: 1;
`;

const CenterName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const CenterDistance = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #3B82F6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const NavigateButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
  
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
`;

const ErrorState = styled.div`
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border-left: 4px solid #F59E0B;
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
      color: #78350f;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
    }
    
    button {
      background: white;
      color: #F59E0B;
      border: 2px solid #F59E0B;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #F59E0B;
        color: white;
      }
    }
  }
`;

const MaterialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: #2563EB;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
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