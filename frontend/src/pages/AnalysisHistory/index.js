// src/pages/AnalysisHistory/index.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { wasteAPI } from "../../services/api";
import LoadingSkeleton from "../../components/Common/LoadingSkeleton";
import {
  PageContainer,
  Container,
  Header,
  StatsBar,
  StatCard,
  Grid,
  AnalysisCard,
  CardHeader,
  CardBody,
  EmptyState,
  LoadingSpinner,
} from "./styledComponents";

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
        <LoadingSkeleton width="100%" height="8rem" />
        <p aria-live="polite">Loading analysis history...</p>
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
