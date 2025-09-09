import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  HomeContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  CTAButton,
  SearchSection,
  SearchContainer,
  SearchInput,
  FilterContainer,
  FilterSelect,
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
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "produce", label: "Fresh Produce" },
    { value: "canned", label: "Canned Goods" },
    { value: "dairy", label: "Dairy Products" },
    { value: "bakery", label: "Bakery Items" },
    { value: "household", label: "Household Items" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchListings();
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, searchTerm, selectedCategory]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getAll({ limit: 20 });
      setListings(response.data.listings || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const filterListings = () => {
    let filtered = [...listings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (listing) => listing.category === selectedCategory
      );
    }

    setFilteredListings(filtered);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
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

      {/* Search and Filter Section */}
      <SearchSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for food and resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterContainer>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>
        </SearchContainer>
      </SearchSection>

      {/* Stats Section */}
      <StatsSection>
        <StatCard>
          <StatNumber>{listings.length}</StatNumber>
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
    </HomeContainer>
  );
};

export default Home;
