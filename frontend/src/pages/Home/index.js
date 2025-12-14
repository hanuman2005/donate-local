// src/pages/Home/index.jsx - CIRCULAR ECONOMY VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api";
import ListingCard from "../../components/ListingCard";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import LiveStats from "../../components/LiveStats";
import DonationCenterInfo from "../../components/DonationCenterInfo";
import { motionVariants } from "../../animations/motionVariants";
import {
  HomeContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  StatsSection,
  StatCard,
  StatNumber,
  StatLabel,
  AboutSection,
  AboutTitle,
  AboutSubtitle,
  AboutGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  PreviewSection,
  SectionTitle,
  ListingsGrid,
} from "./styledComponents";

const Home = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeListings: 0,
    itemsRescued: 3200,
    co2Saved: 4500,
    wasteReduced: 2800,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      setLoading(false);

      const response = await listingsAPI.getAll({
        limit: 6,
        status: "available",
        sort: "-createdAt",
      });

      const listings = response.data.listings || response.data.data || [];
      setRecentListings(listings);

      setStats((prev) => ({
        ...prev,
        activeListings: listings.length,
      }));
    } catch (error) {
      console.error("Error fetching recent listings:", error);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <HomeContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* ========== HERO SECTION ========== */}
      <HeroSection
        as={motion.section}
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <HeroContent>
          <HeroTitle
            as={motion.h1}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            Every Item Deserves a Second Life 🌱
          </HeroTitle>

          <HeroSubtitle
            as={motion.p}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            AI-powered platform that transforms your unused items into opportunities. 
            Get smart reuse ideas, discover recycling centers, and connect with people 
            who need what you have. Together, we're building a waste-free future.
          </HeroSubtitle>

          <motion.div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            variants={motionVariants.staggerContainerFast}
            initial="hidden"
            animate="show"
          >
            <CTAButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStarted}
              $primary
            >
              {user ? "🎯 Open Dashboard" : "🚀 Start Reducing Waste"}
            </CTAButton>

            <CTAButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/listings")}
              $secondary
            >
              🔍 Browse Items
            </CTAButton>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* ========== LIVE STATS COMPONENT ========== */}
      <motion.div
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <LiveStats />
      </motion.div>

      {/* ========== IMPACT STATS SECTION ========== */}
      <StatsSection
        as={motion.section}
        variants={motionVariants.staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.itemsRescued}+</StatNumber>
          <StatLabel>🔄 Items Rescued</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.co2Saved}kg</StatNumber>
          <StatLabel>🌍 CO₂ Prevented</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.wasteReduced}kg</StatNumber>
          <StatLabel>♻️ Waste Reduced</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.activeListings}+</StatNumber>
          <StatLabel>📦 Active Items</StatLabel>
        </StatCard>
      </StatsSection>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <AboutSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <AboutTitle as={motion.h2} variants={motionVariants.fadeSlideUp}>
          Turn Waste Into Worth
        </AboutTitle>

        <AboutSubtitle
          as={motion.p}
          variants={motionVariants.fadeSlideUp}
          transition={{ delay: 0.1 }}
        >
          Our AI analyzes your unused items and shows you the best ways to give them new life - 
          from creative reuse ideas to recycling options and community sharing.
        </AboutSubtitle>

        <AboutGrid as={motion.div} variants={motionVariants.staggerContainer}>
          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FeatureIcon
              as={motion.div}
              animate={{
                rotate: [0, 5, -5, 0],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              📸
            </FeatureIcon>
            <FeatureTitle>1. Upload & Analyze</FeatureTitle>
            <FeatureDescription>
              Snap a photo of your unused item. Our AI instantly identifies it and 
              provides creative reuse ideas, upcycling projects, and proper recycling methods. 
              See the environmental impact of keeping it out of landfills!
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FeatureIcon
              as={motion.div}
              animate={{
                scale: [1, 1.1, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              🎨
            </FeatureIcon>
            <FeatureTitle>2. Discover Options</FeatureTitle>
            <FeatureDescription>
              Get AI-powered suggestions: DIY tutorials to transform your item, nearby 
              recycling centers that accept it, or people in your community who need 
              exactly what you have. Every item has potential!
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FeatureIcon
              as={motion.div}
              animate={{
                y: [0, -5, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              🌟
            </FeatureIcon>
            <FeatureTitle>3. Take Action</FeatureTitle>
            <FeatureDescription>
              Choose your path: start a creative project, locate the nearest recycling 
              facility, or share with someone who needs it. Track your environmental 
              impact and join a community making real change!
            </FeatureDescription>
          </FeatureCard>
        </AboutGrid>
      </AboutSection>

      {/* ========== RECENT LISTINGS PREVIEW ========== */}
      <PreviewSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionTitle as={motion.h2} variants={motionVariants.fadeSlideUp}>
          🔄 Items Ready for New Life
        </SectionTitle>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "3rem",
            }}
          >
            <LoadingSpinner />
          </div>
        ) : recentListings.length > 0 ? (
          <>
            <ListingsGrid
              as={motion.div}
              variants={motionVariants.staggerContainer}
              initial="hidden"
              animate="show"
            >
              {recentListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  variants={motionVariants.listItemSlideUp}
                  custom={index}
                >
                  <ListingCard listing={listing} showQuickClaim={!user} />
                </motion.div>
              ))}
            </ListingsGrid>

            <motion.div
              style={{ textAlign: "center", marginTop: "2rem" }}
              variants={motionVariants.fadeSlideUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <CTAButton
                as={motion.button}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/listings")}
                $secondary
              >
                Explore All Items →
              </CTAButton>
            </motion.div>
          </>
        ) : (
          <motion.div
            variants={motionVariants.scalePop}
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "#f7fafc",
              borderRadius: "15px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
            <p style={{ color: "#718096" }}>Be the first to share an item and start the circular economy!</p>
          </motion.div>
        )}
      </PreviewSection>

      {/* ========== RECYCLING CENTER INFO ========== */}
      <motion.div
        style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <DonationCenterInfo />
      </motion.div>

      {/* ========== WHY CHOOSE US ========== */}
      <AboutSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "4rem 2rem", color: "white" }}
      >
        <AboutTitle as={motion.h2} variants={motionVariants.fadeSlideUp} style={{ color: "white" }}>
          Why Every Item Matters 🌍
        </AboutTitle>

        <AboutGrid as={motion.div} variants={motionVariants.staggerContainer}>
          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <FeatureIcon>♻️</FeatureIcon>
            <FeatureTitle style={{ color: "white" }}>Reduce Waste</FeatureTitle>
            <FeatureDescription style={{ color: "rgba(255,255,255,0.9)" }}>
              Every item diverted from landfills reduces methane emissions and saves resources. 
              Small actions create massive environmental impact.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <FeatureIcon>💡</FeatureIcon>
            <FeatureTitle style={{ color: "white" }}>Learn & Create</FeatureTitle>
            <FeatureDescription style={{ color: "rgba(255,255,255,0.9)" }}>
              Discover creative ways to repurpose items you thought were useless. 
              Our AI provides step-by-step tutorials for amazing transformations.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            as={motion.div}
            variants={motionVariants.scaleIn}
            whileHover={{ y: -10, scale: 1.03 }}
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
          >
            <FeatureIcon>🤝</FeatureIcon>
            <FeatureTitle style={{ color: "white" }}>Build Community</FeatureTitle>
            <FeatureDescription style={{ color: "rgba(255,255,255,0.9)" }}>
              Connect with eco-conscious neighbors. Share skills, trade items, and 
              collectively reduce your community's environmental footprint.
            </FeatureDescription>
          </FeatureCard>
        </AboutGrid>
      </AboutSection>

      {/* ========== FOOTER ========== */}
      <motion.div
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <Footer />
      </motion.div>
    </HomeContainer>
  );
};

export default Home;