// src/pages/Home/index.jsx - SIMPLIFIED LANDING PAGE
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
    totalShared: 2500,
    members: 850,
    poundsSaved: 1200,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      setLoading(false); // Start showing content immediately

      const response = await listingsAPI.getAll({
        limit: 6,
        status: "available",
        sort: "-createdAt",
      });

      const listings = response.data.listings || response.data.data || [];
      setRecentListings(listings);

      // Update stats with real data
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
            Give what you can. Take what you need.
          </HeroTitle>

          <HeroSubtitle
            as={motion.p}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            Join ShareTogether - A real-time platform connecting local
            communities to share items, reduce waste, and help those in need
            through technology.
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
              {user ? "📊 Go to Dashboard" : "🚀 Get Started Free"}
            </CTAButton>

            <CTAButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/listings")}
              $secondary
            >
              🔍 Browse All Items
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

      {/* ========== STATS SECTION ========== */}
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
          <StatNumber>{stats.activeListings}+</StatNumber>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.totalShared}+</StatNumber>
          <StatLabel>Items Shared</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.members}+</StatNumber>
          <StatLabel>Community Members</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>{stats.poundsSaved}+</StatNumber>
          <StatLabel>Pounds Saved</StatLabel>
        </StatCard>
      </StatsSection>

      {/* ========== RECENT LISTINGS PREVIEW ========== */}
      <PreviewSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <SectionTitle as={motion.h2} variants={motionVariants.fadeSlideUp}>
          📦 Recently Shared Items
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
                View All Listings →
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
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <p style={{ color: "#718096" }}>No items available right now</p>
          </motion.div>
        )}
      </PreviewSection>

      {/* ========== DONATION CENTER INFO ========== */}
      <motion.div
        style={{ maxWidth: "1200px", margin: "3rem auto", padding: "0 2rem" }}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <DonationCenterInfo />
      </motion.div>

      {/* ========== HOW IT WORKS SECTION ========== */}
      <AboutSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <AboutTitle as={motion.h2} variants={motionVariants.fadeSlideUp}>
          How ShareTogether Works
        </AboutTitle>

        <AboutSubtitle
          as={motion.p}
          variants={motionVariants.fadeSlideUp}
          transition={{ delay: 0.1 }}
        >
          Join our mission to reduce waste and help those in need. It's simple,
          secure, and makes a real difference in your community.
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
              📱
            </FeatureIcon>
            <FeatureTitle>1. Create Listing</FeatureTitle>
            <FeatureDescription>
              Have items you don't need? Create a free listing in seconds with
              photos, description, and pickup details. Help reduce waste today!
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
              🔍
            </FeatureIcon>
            <FeatureTitle>2. Browse & Connect</FeatureTitle>
            <FeatureDescription>
              Search for available items near you, filter by category, and
              connect directly with donors through our secure messaging system.
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
              🤝
            </FeatureIcon>
            <FeatureTitle>3. Pickup with QR</FeatureTitle>
            <FeatureDescription>
              Use our secure QR code system for contactless pickup verification.
              Safe, simple, and efficient - ensuring smooth transfers every
              time!
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
