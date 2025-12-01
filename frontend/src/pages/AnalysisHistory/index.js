// src/pages/AnalysisHistory/index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { wasteAPI } from "../../services/api";

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8rem 2rem 4rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 3rem;

  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.95;
    margin: 0;
  }
`;

const StatsBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);

  .value {
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
  }

  .label {
    font-size: 0.95rem;
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AnalysisCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  .icon {
    font-size: 3rem;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  .info {
    flex: 1;

    h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .material {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
    }
  }
`;

const CardBody = styled.div`
  display: grid;
  gap: 0.75rem;

  .row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f7fafc;
    border-radius: 10px;

    .label {
      color: #64748b;
      font-weight: 600;
    }

    .value {
      color: #1e293b;
      font-weight: 700;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  .icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;
  }

  h3 {
    font-size: 1.5rem;
    color: white;
    margin: 0 0 1rem 0;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }

  button {
    background: white;
    color: #667eea;
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 4rem;
  color: white;

  .spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AnalysisHistory = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalEcoScore: 0,
    totalCarbonSaved: 0,
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await wasteAPI.getMyHistory();
      const data = response.data.analyses || response.data || [];
      
      setAnalyses(data);

      // Calculate stats
      const totalEcoScore = data.reduce(
        (sum, a) => sum + (a.impact?.ecoScore || 0),
        0
      );
      const totalCarbonSaved = data.reduce(
        (sum, a) => sum + (a.impact?.carbonSaved || 0),
        0
      );

      setStats({
        total: data.length,
        totalEcoScore,
        totalCarbonSaved: totalCarbonSaved.toFixed(1),
      });
    } catch (error) {
      console.error("History error:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (material) => {
    const icons = {
      "E-Waste": "💻",
      Plastic: "♻️",
      "Paper/Cardboard": "📄",
      Glass: "🍾",
      Metal: "🔩",
      "Cloth/Textile": "👕",
      "Organic Waste": "🌱",
    };
    return icons[material] || "📦";
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner" />
          <p>Loading your analysis history...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  if (analyses.length === 0) {
    return (
      <PageContainer>
        <Container>
          <Header>
            <h1>📊 Analysis History</h1>
          </Header>
          <EmptyState>
            <div className="icon">🔍</div>
            <h3>No Analyses Yet</h3>
            <p>Start analyzing items to build your eco-impact history!</p>
            <button onClick={() => navigate("/waste-analyzer")}>
              🤖 Start First Analysis
            </button>
          </EmptyState>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <h1>📊 Your Analysis History</h1>
          <p>Track your environmental impact over time</p>
        </Header>

        <StatsBar
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <StatCard whileHover={{ scale: 1.05 }}>
            <div className="value">{stats.total}</div>
            <div className="label">Total Analyses</div>
          </StatCard>
          <StatCard whileHover={{ scale: 1.05 }}>
            <div className="value">{stats.totalEcoScore}</div>
            <div className="label">Total Eco Points</div>
          </StatCard>
          <StatCard whileHover={{ scale: 1.05 }}>
            <div className="value">{stats.totalCarbonSaved}</div>
            <div className="label">kg CO₂ Saved</div>
          </StatCard>
        </StatsBar>

        <Grid>
          <AnimatePresence>
            {analyses.map((analysis, index) => (
              <AnalysisCard
                key={analysis._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <CardHeader>
                  <div className="icon">
                    {getCategoryIcon(analysis.material)}
                  </div>
                  <div className="info">
                    <h3>{analysis.tfLabel}</h3>
                    <span className="material">{analysis.material}</span>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="row">
                    <span className="label">Confidence:</span>
                    <span className="value">{analysis.confidence}%</span>
                  </div>
                  {/* ✅ ADD THIS: Show analysis count */}
                  {analysis.analysisCount > 1 && (
                    <div className="row">
                      <span className="label">Analyzed:</span>
                      <span className="value">
                        {analysis.analysisCount}× times
                      </span>
                    </div>
                  )}
                  <div className="row">
                    <span className="label">Eco Points:</span>
                    <span className="value">
                      +{analysis.impact?.ecoScore || 0}
                    </span>
                  </div>
                  <div className="row">
                    <span className="label">CO₂ Saved:</span>
                    <span className="value">
                      {analysis.impact?.carbonSaved || 0}kg
                    </span>
                  </div>
                  <div className="row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardBody>
              </AnalysisCard>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>
    </PageContainer>
  );
};

export default AnalysisHistory;
