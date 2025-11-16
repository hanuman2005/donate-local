// src/pages/Home/index.jsx - POLISHED WITH FRAMER MOTION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import FiltersPanel from "../../components/FilterPanel";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import LiveStats from "../../components/LiveStats";
import DonationCenterInfo from "../../components/DonationCenterInfo";
import LiveDonationFeed from "../../components/LiveDonationFeed";
import { motionVariants, useScrollAnimation } from "../../animations/motionVariants";
import {
  HomeContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  ContentSection,
  MapSection,
  ListingsSection,
  SectionTitle,
  ListingsGrid,
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
} from "./styledComponents";

const Home = () => {
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollAnimation = useScrollAnimation();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("📍 User location acquired:", location);
          setUserLocation(location);
        },
        (error) => {
          console.warn("⚠️ Location error:", error.message);
          setUserLocation({
            lat: 16.541936584240865,
            lng: 81.49773371296007,
          });
        }
      );
    } else {
      setUserLocation({
        lat: 16.541936584240865,
        lng: 81.49773371296007,
      });
    }
  };

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  const handleFilterResults = (results, isError = false) => {
    console.log("📥 Received listings:", results?.length || 0);
    setFilteredListings(results || []);
    setLoading(false);
    setError(isError ? "Failed to load listings. Please try again." : null);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Loading timeout - forcing display");
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <HomeContainer
        as={motion.div}
        variants={motionVariants.fadeSlide}
        initial="hidden"
        animate="show"
      >
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <LoadingSpinner />
          <motion.p
            variants={motionVariants.fadeSlideUp}
            style={{ color: "#718096", fontSize: "1.1rem" }}
          >
            Loading listings...
          </motion.p>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Hero Section */}
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
            Give what you don't want and take what you want
          </HeroTitle>
          <HeroSubtitle
            as={motion.p}
            variants={motionVariants.fadeSlideUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
          >
            A real-time platform connecting local communities to share items —
            reducing waste and helping those in need through technology.
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
            >
              {user ? "📊 Go to Dashboard" : "🚀 Get Started"}
            </CTAButton>
            <CTAButton
              as={motion.button}
              variants={motionVariants.scaleIn}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLiveFeed(!showLiveFeed)}
              style={{
                background: showLiveFeed ? "#48bb78" : "transparent",
                border: "2px solid #48bb78",
                color: showLiveFeed ? "white" : "#48bb78",
              }}
            >
              {showLiveFeed ? "📋 List View" : "⚡ Live Feed"}
            </CTAButton>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Live Stats Component */}
      <motion.div variants={motionVariants.fadeSlideUp} {...scrollAnimation}>
        <LiveStats />
      </motion.div>

      {/* Stats Section */}
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
          <StatNumber>{filteredListings.length}</StatNumber>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>
        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>2,500+</StatNumber>
          <StatLabel>Items Shared</StatLabel>
        </StatCard>
        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>850+</StatNumber>
          <StatLabel>Community Members</StatLabel>
        </StatCard>
        <StatCard
          as={motion.div}
          variants={motionVariants.scaleIn}
          whileHover={{ y: -8, scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <StatNumber>1,200+</StatNumber>
          <StatLabel>Pounds Saved</StatLabel>
        </StatCard>
      </StatsSection>

      {/* Donation Center Info */}
      <motion.div
        style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 2rem" }}
        variants={motionVariants.fadeSlideUp}
        {...scrollAnimation}
      >
        <DonationCenterInfo />
      </motion.div>

      {/* About/How It Works Section */}
      <AboutSection
        as={motion.section}
        variants={motionVariants.fadeSlideUp}
        {...scrollAnimation}
      >
        <AboutTitle
          as={motion.h2}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          How ShareTogether Works
        </AboutTitle>
        <AboutSubtitle
          as={motion.p}
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Join our mission to reduce waste and help those in need. It's simple,
          secure, and makes a real difference in your community.
        </AboutSubtitle>
        <AboutGrid
          as={motion.div}
          variants={motionVariants.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
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
            <FeatureTitle>Create Listing</FeatureTitle>
            <FeatureDescription>
              Have items you don't need? Create a free listing in seconds with
              photos, description, and pickup details. Help reduce waste and
              help your community today!
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
            <FeatureTitle>Browse & Connect</FeatureTitle>
            <FeatureDescription>
              Search for available items near you, filter by category and
              urgency, and connect directly with donors through our secure
              messaging system.
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
            <FeatureTitle>Pickup with QR</FeatureTitle>
            <FeatureDescription>
              Use our secure QR code system for contactless pickup verification.
              Safe, simple, and efficient - ensuring smooth transfers every
              time!
            </FeatureDescription>
          </FeatureCard>
        </AboutGrid>
      </AboutSection>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            variants={motionVariants.dropDownSpring}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              background: "#fed7d7",
              color: "#c53030",
              padding: "1rem",
              borderRadius: "10px",
              margin: "2rem auto",
              maxWidth: "600px",
              textAlign: "center",
            }}
          >
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Feed or Regular View */}
      <AnimatePresence mode="wait">
        {showLiveFeed ? (
          <motion.div
            key="live-feed"
            variants={motionVariants.fadeSlide}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{ maxWidth: "1400px", margin: "2rem auto", padding: "0 2rem" }}
          >
            <LiveDonationFeed />
          </motion.div>
        ) : (
          <motion.div
            key="regular-view"
            variants={motionVariants.fadeSlide}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Filters Panel */}
            <motion.div
              variants={motionVariants.fadeSlideUp}
              {...scrollAnimation}
            >
              <FiltersPanel
                autoSearch={true}
                onResults={(results) => handleFilterResults(results, false)}
                userLocation={userLocation}
              />
            </motion.div>

            {/* Content Section */}
            <ContentSection>
              {/* Map Section */}
              <MapSection
                as={motion.div}
                variants={motionVariants.fadeSlideUp}
                {...scrollAnimation}
              >
                <SectionTitle>Find Resources Near You 📍</SectionTitle>
                {filteredListings.length > 0 ? (
                  <motion.div
                    variants={motionVariants.scaleIn}
                    initial="hidden"
                    animate="show"
                  >
                    <Map
                      listings={filteredListings}
                      userLocation={userLocation}
                      height="400px"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    variants={motionVariants.scalePop}
                    initial="hidden"
                    animate="show"
                    style={{
                      height: "400px",
                      background: "#f7fafc",
                      borderRadius: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#718096",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <motion.div
                        style={{ fontSize: "3rem", marginBottom: "1rem" }}
                        animate={{
                          rotate: [0, 10, -10, 0],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        🗺️
                      </motion.div>
                      <p>No listings to display on map</p>
                    </div>
                  </motion.div>
                )}
              </MapSection>

              {/* Listings Section */}
              <ListingsSection
                as={motion.section}
                variants={motionVariants.fadeSlideUp}
                {...scrollAnimation}
              >
                <SectionTitle>
                  Recent Listings ({filteredListings.length})
                </SectionTitle>

                {filteredListings.length === 0 ? (
                  <motion.div
                    variants={motionVariants.scalePop}
                    initial="hidden"
                    animate="show"
                    style={{
                      textAlign: "center",
                      padding: "4rem 2rem",
                      background: "#f7fafc",
                      borderRadius: "15px",
                      margin: "2rem 0",
                    }}
                  >
                    <motion.div
                      style={{ fontSize: "4rem", marginBottom: "1rem" }}
                      animate={{
                        scale: [1, 1.1, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      📭
                    </motion.div>
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        color: "#2d3748",
                        marginBottom: "0.5rem",
                      }}
                    >
                      No listings found
                    </h3>
                    <p
                      style={{
                        fontSize: "1.1rem",
                        color: "#718096",
                        marginBottom: "1.5rem",
                      }}
                    >
                      Try adjusting your filters or be the first to share!
                    </p>
                    {user?.userType === "donor" && (
                      <CTAButton
                        as={motion.button}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/create-listing")}
                        style={{ margin: "0 auto" }}
                      >
                        ➕ Create First Listing
                      </CTAButton>
                    )}
                  </motion.div>
                ) : (
                  <ListingsGrid
                    as={motion.div}
                    variants={motionVariants.staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredListings.slice(0, 6).map((listing, index) => (
                      <motion.div
                        key={listing._id}
                        variants={motionVariants.listItemSlideUp}
                        custom={index}
                      >
                        <ListingCard
                          listing={listing}
                          showQuickClaim={true}
                          showDistance={!!userLocation}
                          userLocation={userLocation}
                        />
                      </motion.div>
                    ))}
                  </ListingsGrid>
                )}

                {filteredListings.length > 6 && (
                  <motion.div
                    style={{
                      textAlign: "center",
                      marginTop: "2rem",
                    }}
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
                      style={{
                        background: "transparent",
                        color: "#667eea",
                        border: "2px solid #667eea",
                        margin: "0 auto",
                      }}
                    >
                      View All {filteredListings.length} Listings →
                    </CTAButton>
                  </motion.div>
                )}
              </ListingsSection>
            </ContentSection>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={motionVariants.fadeSlideUp}
        {...scrollAnimation}
      >
        <Footer />
      </motion.div>
    </HomeContainer>
  );
};

export default Home;