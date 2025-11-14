// src/pages/Home/index.jsx - UPDATED WITH NEW COMPONENTS
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import FiltersPanel from "../../components/FilterPanel";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
// ✅ Import new components
import LiveStats from "../../components/LiveStats";
import DonationCenterInfo from "../../components/DonationCenterInfo";
import LiveDonationFeed from "../../components/LiveDonationFeed";
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
  const [showLiveFeed, setShowLiveFeed] = useState(false); // ✅ Toggle for live feed
  const { user } = useAuth();
  const navigate = useNavigate();

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
      <HomeContainer>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <LoadingSpinner />
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Loading listings...
          </p>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Give what you don't want and take what you want</HeroTitle>
          <HeroSubtitle>
            A real-time platform connecting local communities to share items — reducing waste and helping those in need through technology.
          </HeroSubtitle>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CTAButton onClick={handleGetStarted}>
              {user ? "📊 Go to Dashboard" : "🚀 Get Started"}
            </CTAButton>
            <CTAButton 
              onClick={() => setShowLiveFeed(!showLiveFeed)}
              style={{ 
                background: showLiveFeed ? '#48bb78' : 'transparent',
                border: '2px solid #48bb78',
                color: showLiveFeed ? 'white' : '#48bb78'
              }}
            >
              {showLiveFeed ? "📋 List View" : "⚡ Live Feed"}
            </CTAButton>
          </div>
        </HeroContent>
      </HeroSection>

      {/* ✅ Live Stats Component */}
      <LiveStats />

      {/* Stats Section */}
      <StatsSection>
        <StatCard>
          <StatNumber>{filteredListings.length}</StatNumber>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>2,500+</StatNumber>
          <StatLabel>Items Shared</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>850+</StatNumber>
          <StatLabel>Community Members</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>1,200+</StatNumber>
          <StatLabel>Pounds Saved</StatLabel>
        </StatCard>
      </StatsSection>

      {/* ✅ Donation Center Info */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        <DonationCenterInfo />
      </div>

      {/* About/How It Works Section */}
      <AboutSection>
        <AboutTitle>How ShareTogether Works</AboutTitle>
        <AboutSubtitle>
          Join our mission to reduce waste and help those in need. 
          It's simple, secure, and makes a real difference in your community.
        </AboutSubtitle>
        <AboutGrid>
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Create Listing</FeatureTitle>
            <FeatureDescription>
              Have items you don't need? Create a free listing in seconds with photos,
              description, and pickup details. Help reduce waste and help your community today!
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Browse & Connect</FeatureTitle>
            <FeatureDescription>
              Search for available items near you, filter by category and urgency,
              and connect directly with donors through our secure messaging system.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🤝</FeatureIcon>
            <FeatureTitle>Pickup with QR</FeatureTitle>
            <FeatureDescription>
              Use our secure QR code system for contactless pickup verification.
              Safe, simple, and efficient - ensuring smooth transfers every time!
            </FeatureDescription>
          </FeatureCard>
        </AboutGrid>
      </AboutSection>

      {/* ✅ Error Display */}
      {error && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '1rem',
          borderRadius: '10px',
          margin: '2rem auto',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ✅ Live Feed or Regular View */}
      {showLiveFeed ? (
        <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem' }}>
          <LiveDonationFeed />
        </div>
      ) : (
        <>
          {/* Filters Panel */}
          <FiltersPanel
            autoSearch={true}
            onResults={(results) => handleFilterResults(results, false)}
            userLocation={userLocation}
          />

          {/* Content Section */}
          <ContentSection>
            {/* Map Section */}
            <MapSection>
              <SectionTitle>Find Resources Near You 📍</SectionTitle>
              {filteredListings.length > 0 ? (
                <Map
                  listings={filteredListings}
                  userLocation={userLocation}
                  height="400px"
                />
              ) : (
                <div style={{
                  height: '400px',
                  background: '#f7fafc',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#718096'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <p>No listings to display on map</p>
                  </div>
                </div>
              )}
            </MapSection>

            {/* Listings Section */}
            <ListingsSection>
              <SectionTitle>
                Recent Listings ({filteredListings.length})
              </SectionTitle>

              {filteredListings.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "4rem 2rem",
                  background: '#f7fafc',
                  borderRadius: '15px',
                  margin: '2rem 0'
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📭</div>
                  <h3 style={{ 
                    fontSize: "1.5rem", 
                    color: "#2d3748",
                    marginBottom: "0.5rem"
                  }}>
                    No listings found
                  </h3>
                  <p style={{ 
                    fontSize: "1.1rem", 
                    color: "#718096",
                    marginBottom: "1.5rem"
                  }}>
                    Try adjusting your filters or be the first to share!
                  </p>
                  {user?.userType === 'donor' && (
                    <CTAButton 
                      onClick={() => navigate('/create-listing')}
                      style={{ margin: '0 auto' }}
                    >
                      ➕ Create First Listing
                    </CTAButton>
                  )}
                </div>
              ) : (
                <ListingsGrid>
                  {filteredListings.slice(0, 6).map((listing) => (
                    <ListingCard
                      key={listing._id}
                      listing={listing}
                      showQuickClaim={true}
                      showDistance={!!userLocation}
                      userLocation={userLocation}
                    />
                  ))}
                </ListingsGrid>
              )}

              {filteredListings.length > 6 && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '2rem' 
                }}>
                  <CTAButton 
                    onClick={() => navigate('/listings')}
                    style={{ 
                      background: 'transparent',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      margin: '0 auto'
                    }}
                  >
                    View All {filteredListings.length} Listings →
                  </CTAButton>
                </div>
              )}
            </ListingsSection>
          </ContentSection>
        </>
      )}

      <Footer />
    </HomeContainer>
  );
};

export default Home;