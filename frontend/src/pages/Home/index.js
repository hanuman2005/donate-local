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
} from "./styledComponents";

const Home = () => {
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
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
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Share Food, Build Community</HeroTitle>
          <HeroSubtitle>
            Connect with your neighbors to share surplus food and resources.
            Reduce waste while helping those in need.
          </HeroSubtitle>
          <CTAButton onClick={handleGetStarted}>
            {user ? "Go to Dashboard" : "Get Started"}
          </CTAButton>
        </HeroContent>
      </HeroSection>

      {/* Filters Panel */}
      <FiltersPanel
        onResults={(results) => {
          setFilteredListings(results);
          setLoading(false);
        }}
      />

      {/* Stats Section */}
      <StatsSection>
        <StatCard>
          <StatNumber>{filteredListings.length}</StatNumber>
          <StatLabel>Active Listings</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>500+</StatNumber>
          <StatLabel>Meals Shared</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>200+</StatNumber>
          <StatLabel>Community Members</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>50+</StatNumber>
          <StatLabel>Pounds Saved</StatLabel>
        </StatCard>
      </StatsSection>

      {/* Content Section */}
      <ContentSection>
        {/* Map Section */}
        <MapSection>
          <SectionTitle>Find Resources Near You</SectionTitle>
          <Map
            listings={filteredListings}
            userLocation={userLocation}
            height="400px"
          />
        </MapSection>

        {/* Listings Section */}
        <ListingsSection>
          <SectionTitle>
            Recent Listings ({filteredListings.length})
          </SectionTitle>
          <ListingsGrid>
            {filteredListings.slice(0, 8).map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                showDistance={!!userLocation}
                userLocation={userLocation}
              />
            ))}
          </ListingsGrid>
          {filteredListings.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <p>No listings found matching your criteria.</p>
            </div>
          )}
        </ListingsSection>
      </ContentSection>
      <Footer />
    </HomeContainer>
  );
};

export default Home;
