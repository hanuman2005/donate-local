import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import FiltersPanel from "../../components/FilterPanel";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/Common/LoadingSpinner";

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
  const [loading, setLoading] = useState(true); // ✅ Start with loading true
  const [error, setError] = useState(null); // ✅ Track errors
  const [userLocation, setUserLocation] = useState(null);
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
          // Set default location (Bhimavaram)
          setUserLocation({
            lat: 16.541936584240865,
            lng: 81.49773371296007,
          });
        }
      );
    } else {
      // Fallback to default location
      setUserLocation({
        lat: 16.541936584240865,
        lng: 81.49773371296007,
      });
    }
  };

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  // ✅ Handle results from FiltersPanel
  const handleFilterResults = (results, isError = false) => {
    console.log("📥 Received listings:", results?.length || 0);
    setFilteredListings(results || []);
    setLoading(false);
    setError(isError ? "Failed to load listings. Please try again." : null);
  };

  // ✅ Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("⚠️ Loading timeout - forcing display");
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  // ✅ Show loading state initially
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
            Loading food listings...
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
          <HeroTitle>🍎 Share Food, Build Community</HeroTitle>
          <HeroSubtitle>
            Connect with your neighbors to share surplus food and reduce waste.
            Every meal shared is a step toward a hunger-free community.
          </HeroSubtitle>
          <CTAButton onClick={handleGetStarted}>
            {user ? "📊 Go to Dashboard" : "🚀 Get Started"}
          </CTAButton>
        </HeroContent>
      </HeroSection>

      {/* Stats Section */}
      <StatsSection>
        <StatCard>
          <StatNumber>{filteredListings.length}</StatNumber>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>2,500+</StatNumber>
          <StatLabel>Meals Shared</StatLabel>
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

      {/* About/How It Works Section */}
      <AboutSection>
        <AboutTitle>How FoodShare Works</AboutTitle>
        <AboutSubtitle>
          Join our mission to reduce food waste and help those in need. 
          It's simple, secure, and makes a real difference in your community.
        </AboutSubtitle>
        <AboutGrid>
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Create Listing</FeatureTitle>
            <FeatureDescription>
              Have surplus food? Create a free listing in seconds with photos,
              description, and pickup details. Help reduce waste and feed your community today!
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>Browse & Connect</FeatureTitle>
            <FeatureDescription>
              Search for available food near you, filter by category and urgency,
              and connect directly with donors through our secure messaging system.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🤝</FeatureIcon>
            <FeatureTitle>Pickup with QR</FeatureTitle>
            <FeatureDescription>
              Use our secure QR code system for contactless pickup verification.
              Safe, simple, and efficient - ensuring smooth food transfers every time!
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

          {/* ✅ Improved Empty State */}
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
                  showDistance={!!userLocation}
                  userLocation={userLocation}
                />
              ))}
            </ListingsGrid>
          )}

          {/* ✅ Show "View All" button if more than 6 listings */}
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

      <Footer />
    </HomeContainer>
  );
};

export default Home;