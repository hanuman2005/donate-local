// src/pages/Listings/index.jsx - ENHANCED WITH FILTERS & MAP (FIXED LOADING)
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listingsAPI } from "../../services/api";
import Map from "../../components/Map";
import ListingCard from "../../components/ListingCard";
import FiltersPanel from "../../components/FilterPanel";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { toast } from "react-toastify";
import { motionVariants, useScrollAnimation } from "../../animations/motionVariants";
import {
  ListingsContainer,
  Header,
  Title,
  Subtitle,
  ViewToggle,
  ToggleButton,
  ContentWrapper,
  MapWrapper,
  Grid,
  EmptyState,
  EmptyIcon,
  EmptyText,
  EmptySubtext,
  RetryButton,
  LoadingContainer,
  PaginationControls,
  PageButton,
  PageInfo,
} from "./styledComponents";

const Listings = () => {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [userLocation, setUserLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollAnimation = useScrollAnimation();

  // ✅ FIX: Fetch all listings immediately on mount
  useEffect(() => {
    fetchAllListings();
    getCurrentLocation();
  }, []);

  const fetchAllListings = async () => {
    try {
      console.log("🔄 Fetching all listings...");
      const response = await listingsAPI.getAll({ status: "available" });
      const listings = response.data.listings || response.data.data || [];
      
      console.log("✅ Fetched listings:", listings.length);
      setAllListings(listings);
      setFilteredListings(listings); // Show all by default
      setTotalPages(Math.ceil(listings.length / itemsPerPage));
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching listings:", err);
      setError(err.response?.data?.message || "Failed to load listings");
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
          console.warn("Location access denied");
          setUserLocation({
            lat: 16.541936584240865,
            lng: 81.49773371296007,
          });
        }
      );
    }
  };

  // ✅ FIX: Handle filter results without causing infinite loading
  const handleFilterResults = useCallback((results, isError = false) => {
    console.log("📥 Received filtered results:", results?.length || 0);
    
    if (isError) {
      setError("Failed to apply filters. Showing all listings.");
      setFilteredListings(allListings); // Fallback to all listings
    } else {
      setFilteredListings(results || allListings);
      setTotalPages(Math.ceil((results?.length || 0) / itemsPerPage));
      setCurrentPage(1);
      setError(null);
    }
  }, [allListings]);

  const handleDelete = async (listing) => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }

    try {
      await listingsAPI.delete(listing._id);
      toast.success("Listing deleted successfully");
      
      // Remove from both arrays
      setAllListings(prev => prev.filter(l => l._id !== listing._id));
      setFilteredListings(prev => prev.filter(l => l._id !== listing._id));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  const isOwner = (listing) => {
    if (!user || !listing.donor) return false;
    const donorId = typeof listing.donor === "object" ? listing.donor._id : listing.donor;
    return donorId?.toString() === user._id?.toString();
  };

  // Pagination
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <LoadingContainer
        as={motion.div}
        variants={motionVariants.fadeSlide}
        initial="hidden"
        animate="show"
      >
        <LoadingSpinner size="large" />
        <motion.p
          variants={motionVariants.fadeSlideUp}
          style={{ color: "#718096", fontSize: "1.1rem", marginTop: "1rem" }}
        >
          Loading listings...
        </motion.p>
      </LoadingContainer>
    );
  }

  return (
    <ListingsContainer
      as={motion.div}
      variants={motionVariants.pageTransition}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* ========== HEADER ========== */}
      <Header
        as={motion.div}
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <div>
          <Title>🔍 Browse All Listings</Title>
          <Subtitle>
            {filteredListings.length > 0 
              ? `Found ${filteredListings.length} listing${filteredListings.length !== 1 ? 's' : ''} ready for pickup`
              : "Use filters to find items near you"
            }
          </Subtitle>
        </div>

        {/* VIEW TOGGLE */}
        <ViewToggle
          as={motion.div}
          variants={motionVariants.fadeSlideUp}
        >
          <ToggleButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            $active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          >
            📋 List View
          </ToggleButton>
          <ToggleButton
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            $active={viewMode === "map"}
            onClick={() => setViewMode("map")}
          >
            🗺️ Map View
          </ToggleButton>
        </ViewToggle>
      </Header>

      {/* ========== FILTERS PANEL ========== */}
      <motion.div
        variants={motionVariants.fadeSlideUp}
        initial="hidden"
        animate="show"
      >
        <FiltersPanel
          autoSearch={true}
          onResults={handleFilterResults}
          userLocation={userLocation}
        />
      </motion.div>

      {/* ========== ERROR MESSAGE ========== */}
      {error && (
        <motion.div
          variants={motionVariants.fadeSlideUp}
          initial="hidden"
          animate="show"
          style={{
            background: "#fed7d7",
            color: "#c53030",
            padding: "1rem",
            borderRadius: "12px",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* ========== CONTENT ========== */}
      <ContentWrapper>
        <AnimatePresence mode="wait">
          {viewMode === "map" ? (
            /* ========== MAP VIEW ========== */
            <MapWrapper
              key="map-view"
              as={motion.div}
              variants={motionVariants.fadeSlide}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {filteredListings.length > 0 ? (
                <Map
                  listings={filteredListings}
                  userLocation={userLocation}
                  height="600px"
                />
              ) : (
                <EmptyState style={{ height: "600px" }}>
                  <EmptyIcon>🗺️</EmptyIcon>
                  <EmptyText>No locations to display</EmptyText>
                  <EmptySubtext>Adjust your filters to see results</EmptySubtext>
                </EmptyState>
              )}
            </MapWrapper>
          ) : (
            /* ========== GRID VIEW ========== */
            <motion.div
              key="grid-view"
              variants={motionVariants.fadeSlide}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {paginatedListings.length === 0 ? (
                <EmptyState
                  as={motion.div}
                  variants={motionVariants.scalePop}
                >
                  <EmptyIcon
                    as={motion.div}
                    animate={{
                      y: [0, -15, 0],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    📦
                  </EmptyIcon>
                  <EmptyText>No listings found</EmptyText>
                  <EmptySubtext>
                    {filteredListings.length === 0 && allListings.length > 0
                      ? "Try adjusting your filters"
                      : "No listings available right now. Check back later!"}
                  </EmptySubtext>
                  {user?.userType !== "recipient" && (
                    <RetryButton
                      as={motion.button}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/create-listing")}
                      style={{ marginTop: "1rem" }}
                    >
                      ➕ Create First Listing
                    </RetryButton>
                  )}
                </EmptyState>
              ) : (
                <>
                  <Grid
                    as={motion.div}
                    variants={motionVariants.staggerContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {paginatedListings.map((listing, index) => (
                      <motion.div
                        key={listing._id}
                        variants={motionVariants.listItemSlideUp}
                        custom={index}
                        layout
                      >
                        <ListingCard
                          listing={listing}
                          isOwner={isOwner(listing)}
                          showQuickClaim={true}
                          showDistance={!!userLocation}
                          userLocation={userLocation}
                          onDelete={handleDelete}
                        />
                      </motion.div>
                    ))}
                  </Grid>

                  {/* ========== PAGINATION ========== */}
                  {totalPages > 1 && (
                    <PaginationControls
                      as={motion.div}
                      variants={motionVariants.fadeSlideUp}
                      initial="hidden"
                      animate="show"
                    >
                      <PageButton
                        as={motion.button}
                        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </PageButton>

                      <PageInfo>
                        Page {currentPage} of {totalPages}
                      </PageInfo>

                      <PageButton
                        as={motion.button}
                        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </PageButton>
                    </PaginationControls>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </ListingsContainer>
  );
};

export default Listings;