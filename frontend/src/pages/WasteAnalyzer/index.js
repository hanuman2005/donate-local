import LoadingSkeleton from "../../components/Common/LoadingSkeleton";
import { useCallback } from "react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import {
  classifyWasteItem,
  getWasteAdvice,
  calculateEcoImpact,
  getRandomMotivation,
} from "../../utils/wasteClassifier";
import NearbyCentersSection from "../../components/AI/AiWasteAnalyzer.js";
import { analyzeMaterialComposition } from "../../utils/materialCompositionAnalyzer";
import MaterialCompositionDisplay from "../../components/Map/MaterialCompositionDisplay";
import UpcycleModal from "./UpcycleModal";
import {
  PageContainer,
  ContentWrapper,
  Hero,
  Title,
  Subtitle,
  Card,
  UploadZone,
  ImageGrid,
  ImageCard,
  ImageNumber,
  RemoveImageButton,
  UploadInfo,
  ButtonGroup,
  Button,
  ResultsCard,
  ResultHeader,
  SuccessBadge,
  ItemName,
  MaterialTag,
  ConfidenceBar,
  ImageCarousel,
  CarouselImage,
  CarouselControls,
  CarouselDot,
  ImageCounter,
  EnhancedAnalysisBadge,
  SectionGrid,
  SectionCard,
  ImpactSection,
  ImpactGrid,
  ImpactCard,
  MotivationBanner,
  LoadingOverlay,
  LoadingCard,
  // HiddenInput,
} from "./styledComponents";

// =====================
// Main Component
// =====================
const WasteAnalyzer = () => {
  // Load TensorFlow model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
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
  // Confetti effect function
  const createConfetti = () => {
    const colors = [
      "var(--primary)",
      "var(--primary-dark)",
      "var(--success-bg)",
      "var(--warning)",
      "var(--accent)",
    ];
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
  // State and refs
  const [model, setModel] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpcycleModal, setShowUpcycleModal] = useState(false);
  const [upcycleIdeas, setUpcycleIdeas] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handleShowCenters = useCallback(async () => {
    setShowCenters(true);
    setCenters(await fetchCenters("recycling"));
  }, []);
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
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      handleImageFile(files);
    } else {
      toast.error("Please upload image files only");
    }
  };
  // handleFileSelect is not needed; file input is handled via onClick and handleImageFile
  const handleImageFile = (files) => {
    const fileArray = Array.isArray(files) ? files : [files];
    // Filter out files already uploaded (by name and size)
    const existingFiles = uploadedImages;
    const newFiles = fileArray.filter(
      (file) =>
        !existingFiles.some((f) => f.name === file.name && f.size === file.size)
    );
    // Only add up to 5 total
    const filesToAdd = newFiles.slice(0, 5 - existingFiles.length);
    if (filesToAdd.length === 0) {
      toast.info("No new images to add.");
      return;
    }
    let loadedCount = 0;
    const newPreviews = [];
    filesToAdd.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[idx] = e.target.result;
        loadedCount++;
        if (loadedCount === filesToAdd.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
          setUploadedImages((prev) => [...prev, ...filesToAdd].slice(0, 5));
          setResult(null);
          toast.success(`✅ ${filesToAdd.length} new image(s) added!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const classToWasteCategory = {
    can: "Metal",
    "water bottle": "Plastic",
    "plastic bag": "Plastic",
    carton: "Paper",
    "paper towel": "Paper",
    banana: "Organic",
    orange: "Organic",
    bottlecap: "Metal",
    "milk can": "Metal",
    packet: "Plastic",
    envelope: "Paper",
    "toilet tissue": "Paper",
    matchstick: "Wood",
    screw: "Metal",
    nail: "Metal",
    "tin can": "Metal",
    "book jacket": "Paper",
    newspaper: "Paper",
    magazine: "Paper",
    bottle: "Plastic",
    glass: "Glass",
    "wine bottle": "Glass",
    "beer bottle": "Glass",
    cup: "Plastic",
    plate: "Plastic",
    fork: "Plastic",
    spoon: "Plastic",
    knife: "Plastic",
    egg: "Organic",
    apple: "Organic",
    lemon: "Organic",
    cucumber: "Organic",
    potato: "Organic",
    carrot: "Organic",
    broccoli: "Organic",
    lettuce: "Organic",
    strawberry: "Organic",
    "granny smith": "Organic",
    lime: "Organic",
    eggplant: "Organic",
    zucchini: "Organic",
    cabbage: "Organic",
    onion: "Organic",
    garlic: "Organic",
    mushroom: "Organic",
    corn: "Organic",
    "pop bottle": "Plastic",
    "soda bottle": "Plastic",
    tin: "Metal",
    "aluminum can": "Metal",
    "steel can": "Metal",
    "cardboard box": "Paper",
    "pizza box": "Paper",
    "egg carton": "Paper",
    "plastic container": "Plastic",
    "plastic cup": "Plastic",
    "plastic plate": "Plastic",
    "plastic fork": "Plastic",
    "plastic spoon": "Plastic",
    "plastic knife": "Plastic",
    "plastic straw": "Plastic",
    "plastic lid": "Plastic",
    "plastic wrap": "Plastic",
    "glass jar": "Glass",
    "glass bottle": "Glass",
    jar: "Glass",
    book: "Paper",
    notebook: "Paper",
    tissue: "Paper",
    napkin: "Paper",
    "paper bag": "Paper",
    "paper cup": "Paper",
    "paper plate": "Paper",
    wood: "Wood",
    stick: "Wood",
    branch: "Wood",
    leaf: "Organic",
    flower: "Organic",
    plant: "Organic",
    food: "Organic",
    fruit: "Organic",
    vegetable: "Organic",
    // fallback
  };
  const [centers, setCenters] = useState([]);
  const [showCenters, setShowCenters] = useState(false);

  const fetchCenters = async (type = "recycling") => {
    try {
      const res = await fetch(`/api/centers?type=${type}`);
      if (!res.ok) throw new Error("Failed to fetch centers");
      return await res.json();
    } catch (e) {
      toast.error("Could not load centers");
      return [];
    }
  };

  const CONFIDENCE_THRESHOLD = 0.6; // 60%

  const handleAnalyze = async () => {
    if (uploadedImages.length === 0 || !model) {
      toast.error("Please upload at least one image");
      return;
    }

    setAnalyzing(true);

    try {
      console.log(`🔬 Analyzing ${uploadedImages.length} image(s)...`);

      const allPredictions = [];
      const allMaterialAnalyses = [];

      for (let i = 0; i < imagePreviews.length; i++) {
        const img = new Image();
        img.src = imagePreviews[i];

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const predictions = await model.classify(img);
        allPredictions.push(predictions[0]);

        const materialAnalysis = await analyzeMaterialComposition(img);
        allMaterialAnalyses.push(materialAnalysis);

        console.log(`✅ Image ${i + 1}/${imagePreviews.length} analyzed`);
      }

      const aggregatedResult = aggregateAnalyses(
        allPredictions,
        allMaterialAnalyses
      );

      // Use confidence threshold
      if (aggregatedResult.bestPrediction.probability < CONFIDENCE_THRESHOLD) {
        setResult({
          label: "Uncertain",
          confidence: (aggregatedResult.averageConfidence * 100).toFixed(1),
          material: "Unknown",
          uncertain: true,
        });
        toast.warn(
          "AI is not confident in its prediction. Please try another image or retake the photo."
        );
        setShowConfetti(false);
        setAnalyzing(false);
        return;
      }

      // Map MobileNet class to waste category if possible
      const mappedCategory =
        classToWasteCategory[
          aggregatedResult.bestPrediction.className.toLowerCase()
        ] || classifyWasteItem(aggregatedResult.bestPrediction.className);
      const wasteCategory = mappedCategory;
      const advice = getWasteAdvice(wasteCategory);
      const impact = calculateEcoImpact(wasteCategory);

      const analysisResult = {
        label: aggregatedResult.bestPrediction.className,
        confidence: (aggregatedResult.averageConfidence * 100).toFixed(1),
        material: wasteCategory,
        ...advice,
        impact,
        motivation: getRandomMotivation(),
        totalImagesAnalyzed: uploadedImages.length,
        materialComposition: aggregatedResult.materials,
        recyclingComplexity: aggregatedResult.recyclingComplexity,
        environmentalImpact: aggregatedResult.environmentalImpact,
        hazards: aggregatedResult.hazards,
        recyclingRecommendations: aggregatedResult.recyclingRecommendations,
        eWasteCategory: aggregatedResult.eWasteCategory,
      };

      try {
        const { wasteAPI } = await import("../../services/api");
        await wasteAPI.saveAnalysis({
          tfLabel: aggregatedResult.bestPrediction.className,
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
          materialComposition: aggregatedResult.materials,
          recyclingComplexity: aggregatedResult.recyclingComplexity,
          environmentalImpact: aggregatedResult.environmentalImpact,
          hazards: aggregatedResult.hazards,
          recyclingRecommendations: aggregatedResult.recyclingRecommendations,
          eWasteCategory: aggregatedResult.eWasteCategory,
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent)
            ? "mobile"
            : "desktop",
        });

        toast.success("🎉 Analysis saved!");
      } catch (saveError) {
        console.error("Backend save failed:", saveError);
      }

      setResult(analysisResult);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      toast.success(
        `✅ ${uploadedImages.length} images analyzed successfully!`
      );
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const aggregateAnalyses = (predictions, materialAnalyses) => {
    const bestPrediction = predictions.reduce((best, current) =>
      current.probability > best.probability ? current : best
    );

    const averageConfidence =
      predictions.reduce((sum, p) => sum + p.probability, 0) /
      predictions.length;

    const bestMaterialAnalysis = materialAnalyses.reduce((best, current) =>
      (current.materials?.length || 0) > (best.materials?.length || 0)
        ? current
        : best
    );

    const allHazards = {
      hasHazardousMaterials: materialAnalyses.some(
        (m) => m.hazards?.hasHazardousMaterials
      ),
      criticalHazards: [],
      mediumHazards: [],
      handlingInstructions: [],
    };

    materialAnalyses.forEach((m) => {
      if (m.hazards?.criticalHazards) {
        allHazards.criticalHazards.push(...m.hazards.criticalHazards);
      }
      if (m.hazards?.mediumHazards) {
        allHazards.mediumHazards.push(...m.hazards.mediumHazards);
      }
      if (m.hazards?.handlingInstructions) {
        allHazards.handlingInstructions.push(...m.hazards.handlingInstructions);
      }
    });

    allHazards.criticalHazards = Array.from(
      new Set(allHazards.criticalHazards.map((h) => JSON.stringify(h)))
    ).map((h) => JSON.parse(h));

    return {
      bestPrediction,
      averageConfidence,
      materials: bestMaterialAnalysis.materials || [],
      recyclingComplexity: bestMaterialAnalysis.recyclingComplexity,
      environmentalImpact: bestMaterialAnalysis.environmentalImpact,
      hazards: allHazards,
      recyclingRecommendations: bestMaterialAnalysis.recyclingRecommendations,
      eWasteCategory: bestMaterialAnalysis.eWasteCategory,
    };
  };

  const handleRemoveImage = (indexToRemove = null) => {
    if (indexToRemove !== null) {
      const newPreviews = imagePreviews.filter((_, i) => i !== indexToRemove);
      const newImages = uploadedImages.filter((_, i) => i !== indexToRemove);
      setImagePreviews(newPreviews);
      setUploadedImages(newImages);

      if (newPreviews.length === 0) {
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      toast.info(`Removed image ${indexToRemove + 1}`);
    } else {
      setImagePreviews([]);
      setUploadedImages([]);
      setResult(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    handleRemoveImage(null);
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
          image: imagePreviews[0],
        },
      },
    });
  };

  // ✅ NEW: Handle AI Upcycling Ideas
  const handleGetUpcycleIdeas = async () => {
    if (!result) {
      toast.error("Please analyze an item first");
      return;
    }

    setLoadingIdeas(true);
    try {
      const { aiAPI } = await import("../../services/api");

      const response = await aiAPI.generateUpcyclingIdeas({
        itemLabel: result.label,
        condition: "fair", // You can add a condition field to your form
        material: result.material || "general",
      });

      setUpcycleIdeas(response.data.data);
      setShowUpcycleModal(true);
      toast.success("✨ AI generated creative ideas!");
    } catch (error) {
      console.error("Error getting upcycle ideas:", error);

      if (error.response?.status === 429) {
        toast.error("Daily limit reached. Try again tomorrow!");
      } else if (error.response?.status === 401) {
        toast.error("Please login to use AI features");
      } else {
        toast.error("Failed to generate ideas. Please try again.");
      }
    } finally {
      setLoadingIdeas(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <LoadingCard>
            <div className="spinner" />
            <h3>Loading AI Model...</h3>
            <p>Preparing smart waste analysis</p>
            <LoadingSkeleton
              width="100%"
              height="2rem"
              style={{ marginTop: 16 }}
            />
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
            {imagePreviews.length === 0 ? (
              <>
                {/* Show nearby centers if AI recommends recycling */}
                {result && result.advice === "Recycle" && (
                  <section>
                    <h3>Nearby Recycling Centers</h3>
                    <button
                      onClick={handleShowCenters}
                      style={{ marginBottom: 8 }}
                    >
                      Show Centers
                    </button>
                    {showCenters &&
                      (centers.length === 0 ? (
                        <p>No centers found nearby.</p>
                      ) : (
                        <ul>
                          {centers.map((center) => (
                            <li key={center._id}>
                              <strong>{center.name}</strong> - {center.address}{" "}
                              ({center.type})
                            </li>
                          ))}
                        </ul>
                      ))}
                  </section>
                )}
                <UploadZone
                  $isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="icon">📸</div>
                  <h3>Drop Multiple Images Here</h3>
                  <p>or click to browse • Up to 5 images • JPG, PNG</p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      marginTop: "0.5rem",
                      color: "#667eea",
                    }}
                  >
                    💡 More photos = Better AI analysis!
                  </p>
                </UploadZone>
              </>
            ) : (
              <>
                <ImageGrid>
                  {imagePreviews.map((preview, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ImageCard>
                        <img src={preview} alt={`Upload ${index + 1}`} />
                        <ImageNumber>{index + 1}</ImageNumber>
                        <RemoveImageButton
                          onClick={() => handleRemoveImage(index)}
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </RemoveImageButton>
                      </ImageCard>
                    </motion.div>
                  ))}
                </ImageGrid>

                <UploadInfo>
                  <strong>{imagePreviews.length}</strong> image
                  {imagePreviews.length > 1 ? "s" : ""} uploaded
                  {imagePreviews.length < 5 && (
                    <> • You can add up to {5 - imagePreviews.length} more</>
                  )}
                </UploadInfo>

                <ButtonGroup>
                  <Button onClick={() => handleRemoveImage(null)}>
                    🗑️ Remove All
                  </Button>
                  <Button
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      fileInputRef.current?.click();
                    }}
                    disabled={imagePreviews.length >= 5}
                  >
                    ➕ Add More Photos
                  </Button>
                  <Button
                    $primary
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {analyzing
                      ? `🔄 Analyzing ${imagePreviews.length} images...`
                      : `🤖 Analyze All Images`}
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

            {imagePreviews.length > 1 ? (
              <ImageCarousel>
                <CarouselImage
                  src={imagePreviews[currentImageIndex]}
                  alt={`Analyzed ${currentImageIndex + 1}`}
                />
                <ImageCounter>
                  {currentImageIndex + 1} / {imagePreviews.length}
                </ImageCounter>
                <CarouselControls>
                  {imagePreviews.map((_, index) => (
                    <CarouselDot
                      key={index}
                      $active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </CarouselControls>
              </ImageCarousel>
            ) : (
              <ImageCarousel>
                <CarouselImage src={imagePreviews[0]} alt="Analyzed" />
              </ImageCarousel>
            )}

            {result.totalImagesAnalyzed > 1 && (
              <EnhancedAnalysisBadge>
                📸 Enhanced Analysis: {result.totalImagesAnalyzed} images
                processed
                <br />
                <span>Higher accuracy with multiple perspectives</span>
              </EnhancedAnalysisBadge>
            )}

            {/* ✅ NEW: AI Upcycling Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{ textAlign: "center", margin: "1.5rem 0" }}
            >
              <Button
                $primary
                onClick={handleGetUpcycleIdeas}
                disabled={loadingIdeas}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  fontSize: "1.1rem",
                  padding: "1rem 2rem",
                  boxShadow: "0 8px 25px rgba(240, 147, 251, 0.3)",
                }}
              >
                {loadingIdeas
                  ? "✨ Generating Ideas..."
                  : "💡 Get AI Upcycling Ideas"}
              </Button>
            </motion.div>

            <MaterialCompositionDisplay analysis={result} />

            <SectionGrid>
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
                  {(result.reuseIdeas || []).map((idea, i) => (
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
                    {(result.upcycleIdeas || []).map((idea, i) => (
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

              <NearbyCentersSection material={result.material} />
            </SectionGrid>

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
                    {result.impact?.carbonSaved ?? 0}
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
                    {result.impact?.wasteDiverted ?? 0}
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
                    +{result.impact?.ecoScore ?? 0}
                  </motion.div>
                  <div className="label">Eco Points 🏆</div>
                </ImpactCard>
              </ImpactGrid>
            </ImpactSection>

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

      {/* ✅ NEW: Upcycle Modal */}
      <UpcycleModal
        isOpen={showUpcycleModal}
        onClose={() => setShowUpcycleModal(false)}
        ideas={upcycleIdeas}
      />

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
              <p>
                Processing {imagePreviews.length} image
                {imagePreviews.length > 1 ? "s" : ""} for accurate material
                detection
              </p>
            </LoadingCard>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default WasteAnalyzer;
