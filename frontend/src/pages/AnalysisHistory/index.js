// src/pages/AnalysisHistory/index.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { wasteAPI } from '../../services/api';

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 6rem 2rem 4rem;
  margin-top: 80px;
  max-width: 1200px;
  margin: 80px auto 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const AnalysisCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await wasteAPI.getMyHistory();
      setAnalyses(response.data.analyses);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <Title>📊 My Analysis History</Title>
      <Grid>
        {analyses.map((analysis) => (
          <AnalysisCard key={analysis._id}>
            <h3>{analysis.tfLabel}</h3>
            <p>Material: {analysis.material}</p>
            <p>Confidence: {analysis.confidence}%</p>
            <p>Eco Score: +{analysis.impact.ecoScore}</p>
            <p>{new Date(analysis.createdAt).toLocaleDateString()}</p>
          </AnalysisCard>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default AnalysisHistory;