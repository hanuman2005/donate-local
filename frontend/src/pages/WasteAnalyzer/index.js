// src/pages/WasteAnalyzer/index.js - STUNNING VERSION
import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import { motionVariants } from "../../animations/motionVariants";
import {
  classifyWasteItem,
  getWasteAdvice,
  calculateEcoImpact,
  getRandomMotivation,
} from "../../utils/wasteClassifier";
import NearbyCentersSection from "../../components/AIWasteAnalyzer";

// =====================
// Animations
// =====================
const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8); }
`;

const slideInFromRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(1000px) rotate(720deg); opacity: 0; }
`;

// =====================
// Styled Components
// =====================
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 50px 50px;
    animation: ${float} 20s ease-in-out infinite;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 10rem 2rem 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 6rem 1rem 2rem;
  }
`;

const Hero = styled(motion.div)`
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #fff, #a8dadc, #fff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
    border-radius: 32px;
    z-index: -1;
    animation: ${shimmer} 3s infinite;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    border-radius: 24px;
  }
`;

const UploadZone = styled.div`
  border: 4px dashed ${(props) => (props.$isDragging ? "#667eea" : "#cbd5e0")};
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  background: ${(props) =>
    props.$isDragging
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
      : "linear-gradient(135deg, #f7fafc, #edf2f7)"};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #667eea;
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }

  .icon {
    font-size: 5rem;
    margin-bottom: 1rem;
    animation: ${float} 3s ease-in-out infinite;
  }

  h3 {
    font-size: 1.75rem;
    color: #2d3748;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin: 2rem 0;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
    display: block;
    background: #000;
  }

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    pointer-events: none;
  }
`;

const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(229, 62, 62, 0.95);
  backdrop-filter: blur(10px);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    
    &:hover {
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
      transform: translateY(-3px);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `
      : `
    background: linear-gradient(135deg, #f7fafc, #edf2f7);
    color: #4a5568;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: linear-gradient(135deg, #edf2f7, #e2e8f0);
      transform: translateY(-2px);
    }
  `}
`;

const ResultsCard = styled(Card)`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(247, 250, 252, 0.95) 100%
  );
  animation: ${slideInFromRight} 0.5s ease-out;
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  .confetti-wrapper {
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    height: 200px;
    pointer-events: none;
    overflow: hidden;
  }

  .confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #667eea;
    animation: ${confetti} 3s ease-out forwards;
  }
`;

const SuccessBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.4);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ItemName = styled(motion.h2)`
  font-size: 3rem;
  color: #2d3748;
  margin: 0 0 1rem 0;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MaterialTag = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
`;

const ConfidenceBar = styled.div`
  margin: 1.5rem auto;
  max-width: 400px;

  .label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: #718096;
    font-weight: 600;
  }

  .bar-container {
    height: 12px;
    background: #e2e8f0;
    border-radius: 50px;
    overflow: hidden;
    position: relative;
  }

  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78 0%, #38a169 100%);
    border-radius: 50px;
    transition: width 1s ease-out;
    position: relative;
    overflow: hidden;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 100%
      );
      animation: ${shimmer} 2s infinite;
    }
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const SectionCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
  }

  .header {
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

    h3 {
      font-size: 1.5rem;
      color: #2d3748;
      margin: 0;
      font-weight: 700;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 1rem;
      margin-bottom: 0.75rem;
      color: #4a5568;
      font-size: 1.05rem;
      display: flex;
      align-items: start;
      gap: 1rem;
      background: linear-gradient(135deg, #f7fafc, #edf2f7);
      border-radius: 12px;
      border-left: 4px solid #48bb78;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #edf2f7, #e2e8f0);
        transform: translateX(5px);
      }

      &:before {
        content: "✓";
        color: #48bb78;
        font-weight: bold;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
    }
  }

  .recycling-text {
    color: #4a5568;
    line-height: 1.8;
    font-size: 1.05rem;
    background: linear-gradient(135deg, #f7fafc, #edf2f7);
    padding: 1.5rem;
    border-radius: 16px;
    border-left: 4px solid #667eea;
  }
`;

const ImpactSection = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32px;
  padding: 3rem;
  color: white;
  margin: 3rem 0;
  text-align: center;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 1px,
      transparent 1px
    );
    background-size: 30px 30px;
    animation: ${float} 15s ease-in-out infinite;
  }

  h3 {
    font-size: 2.5rem;
    margin: 0 0 2.5rem 0;
    font-weight: 900;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 1;
  }
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

const ImpactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }

  .value {
    font-size: 4rem;
    font-weight: 900;
    margin-bottom: 0.5rem;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  .label {
    font-size: 1.1rem;
    opacity: 0.95;
    font-weight: 600;
  }
`;

const MotivationBanner = styled(motion.div)`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(72, 187, 120, 0.3);
  animation: ${glow} 2s ease-in-out infinite;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 4rem 3rem;
  text-align: center;
  max-width: 500px;
  margin: 0 1rem;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);

  .spinner {
    width: 80px;
    height: 80px;
    border: 6px solid #e2e8f0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  h3 {
    font-size: 2rem;
    margin: 0 0 0.75rem;
    color: #2d3748;
    font-weight: 700;
  }

  p {
    color: #718096;
    font-size: 1.1rem;
    margin: 0;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// =====================
// Main Component
// =====================
const WasteAnalyzer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [model, setModel] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log("🤖 Loading AI model...");
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("✅ Model loaded!");
        toast.success("🤖 AI Ready to Analyze!");
      } catch (error) {
        console.error("Model error:", error);
        toast.error("Failed to load AI model");
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  // Create confetti effect
  const createConfetti = () => {
    const colors = ["#667eea", "#764ba2", "#48bb78", "#ed8936", "#f093fb"];
    const confettiElements = [];
    for (let i = 0; i < 50; i++) {
      confettiElements.push(
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      );
    }
    return confettiElements;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    } else {
      toast.error("Please upload an image file");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setUploadedImage(file);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedImage || !model) {
      toast.error("Please upload an image first");
      return;
    }

    setAnalyzing(true);

    try {
      const img = new Image();
      img.src = imagePreview;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const predictions = await model.classify(img);
      const topPrediction = predictions[0];

      const wasteCategory = classifyWasteItem(topPrediction.className);
      const advice = getWasteAdvice(wasteCategory);
      const impact = calculateEcoImpact(wasteCategory);

      const analysisResult = {
        label: topPrediction.className,
        confidence: (topPrediction.probability * 100).toFixed(1),
        material: wasteCategory,
        ...advice,
        impact,
        motivation: getRandomMotivation(),
      };

      // Save to backend
      try {
        const { wasteAPI } = await import("../../services/api");
        const saveResponse = await wasteAPI.saveAnalysis({
          tfLabel: topPrediction.className,
          confidence: parseFloat(analysisResult.confidence),
          material: wasteCategory,
          reuseIdeas: advice.reuseIdeas,
          upcycleIdeas: advice.upcycleIdeas,
          recyclingGuidance: advice.recyclingGuidance,
          donationPossible: advice.donationPossible,
          donationCategory: advice.donationCategory,
          impact: {
            carbonSaved: impact.carbonSaved,
            wasteDiverted: impact.wasteDiverted,
            ecoScore: impact.ecoScore,
          },
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? "mobile"
            : "desktop",
        });
        if (saveResponse.data?.isDuplicate) {
          toast.info(`♻️ Updated previous analysis!`, { autoClose: 3500 });
        } else {
          toast.success("🎉 New analysis added!");
        }
      } catch (saveError) {
        console.error("Backend save failed:", saveError);
      }

      setResult(analysisResult);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success("✅ Analysis Complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Try another photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    handleRemoveImage();
  };

  const handleCreateListing = () => {
    if (!result) return;
    navigate("/create-listing", {
      state: {
        fromAI: true,
        aiData: {
          title: result.label,
          category: result.donationCategory || "other",
          description: `${result.label} - ${result.material}`,
          image: imagePreview,
        },
      },
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LoadingCard>
            <div className="spinner" />
            <h3>Loading AI Model...</h3>
            <p>Preparing smart waste analysis</p>
          </LoadingCard>
        </LoadingOverlay>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ContentWrapper>
        <Hero>
          <Title
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🤖 AI Waste Analyzer
          </Title>
          <Subtitle
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Transform waste into opportunity with intelligent analysis
          </Subtitle>
        </Hero>

        {!result ? (
          <Card
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!imagePreview ? (
              <>
                <UploadZone
                  $isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="icon">📸</div>
                  <h3>Drop Your Image Here</h3>
                  <p>or click to browse • Supports JPG, PNG</p>
                </UploadZone>
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                />
              </>
            ) : (
              <>
                <ImagePreview>
                  <img src={imagePreview} alt="Upload" />
                  <RemoveButton
                    onClick={handleRemoveImage}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </RemoveButton>
                </ImagePreview>
                <ButtonGroup>
                  <Button onClick={handleRemoveImage}>
                    📷 Choose Different
                  </Button>
                  <Button
                    $primary
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {analyzing ? "🔄 Analyzing..." : "🤖 Analyze with AI"}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Card>
        ) : (
          <ResultsCard
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <ResultHeader>
              {showConfetti && (
                <div className="confetti-wrapper">{createConfetti()}</div>
              )}

              <SuccessBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span>✨</span>
                <span>Analysis Complete!</span>
                <span>🎉</span>
              </SuccessBadge>

              <ItemName
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {result.label}
              </ItemName>

              <MaterialTag>📦 Material: {result.material}</MaterialTag>

              <ConfidenceBar>
                <div className="label">
                  <span>AI Confidence</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="bar-container">
                  <motion.div
                    className="bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </ConfidenceBar>
            </ResultHeader>

            <MotivationBanner
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {result.motivation}
            </MotivationBanner>

            <ImagePreview style={{ marginTop: "2rem" }}>
              <img src={imagePreview} alt="Analyzed" />
            </ImagePreview>

            <SectionGrid>
              {/* Reuse Ideas */}
              <SectionCard
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="header">
                  <div className="icon">🔄</div>
                  <h3>Reuse Ideas</h3>
                </div>
                <ul>
                  {result.reuseIdeas.map((idea, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      {idea}
                    </motion.li>
                  ))}
                </ul>
              </SectionCard>

              {/* Upcycle Ideas */}
              {result.upcycleIdeas && result.upcycleIdeas.length > 0 && (
                <SectionCard
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="header">
                    <div className="icon">✨</div>
                    <h3>Upcycle Ideas</h3>
                  </div>
                  <ul>
                    {result.upcycleIdeas.map((idea, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 + i * 0.1 }}
                      >
                        {idea}
                      </motion.li>
                    ))}
                  </ul>
                </SectionCard>
              )}

              {/* Recycling Guidance Section */}
              <SectionCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="header">
                  <div className="icon">♻️</div>
                  <h3>Recycling Guide</h3>
                </div>
                <div className="recycling-text">{result.recyclingGuidance}</div>
              </SectionCard>

              {/* 🆕 ADD THIS: Nearby Recycling Centers */}
              <NearbyCentersSection material={result.material} />
            </SectionGrid>

            {/* Impact Section */}
            <ImpactSection
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <h3>🌍 Your Environmental Impact</h3>
              <ImpactGrid>
                <ImpactCard
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.3, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    {result.impact.carbonSaved}
                  </motion.div>
                  <div className="label">kg CO₂ Saved</div>
                </ImpactCard>

                <ImpactCard
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    {result.impact.wasteDiverted}
                  </motion.div>
                  <div className="label">kg Waste Diverted</div>
                </ImpactCard>

                <ImpactCard
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="value"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    +{result.impact.ecoScore}
                  </motion.div>
                  <div className="label">Eco Points 🏆</div>
                </ImpactCard>
              </ImpactGrid>
            </ImpactSection>

            {/* Action Buttons */}
            <ButtonGroup>
              <Button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Analyze Another Item
              </Button>
              {result.donationPossible && (
                <Button
                  $primary
                  onClick={handleCreateListing}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎁 Create Donation Listing
                </Button>
              )}
            </ButtonGroup>
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                onClick={() => navigate("/analysis-history")}
                style={{
                  background: "transparent",
                  border: "2px solid #667eea",
                  color: "#667eea",
                }}
              >
                📊 View All My Analyses
              </Button>
            </div>
          </ResultsCard>
        )}
      </ContentWrapper>

      {/* Loading Overlay During Analysis */}
      <AnimatePresence>
        {analyzing && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingCard
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="spinner" />
              <h3>🤖 AI Analyzing...</h3>
              <p>Identifying material and generating insights</p>
            </LoadingCard>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default WasteAnalyzer;
