// src/pages/Listings/index.jsx - POLISHED WITH FRAMER MOTION
import styled from "styled-components";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import ListingCard from "../../components/ListingCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motionVariants, useScrollAnimation } from "../../animations/motionVariants";

const ListingsContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 80px;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const EmptyText = styled.div`
  font-size: 1.3rem;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.div`
  font-size: 1rem;
  color: #a0aec0;
`;

const RetryButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const scrollAnimation = useScrollAnimation();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching listings...");

      const response = await api.get("/listings");
      console.log("📥 Response:", response.data);

      const fetchedListings = response.data.listings || response.data.data || [];

      console.log("✅ Listings fetched:", fetchedListings.length);
      setListings(fetchedListings);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching listings:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listing) => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }

    try {
      console.log("🗑️ Deleting listing:", listing._id);
      await api.delete(`/listings/${listing._id}`);

      toast.success("Listing deleted successfully");

      setListings((prev) => prev.filter((l) => l._id !== listing._id));
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  const isOwner = (listing) => {
    if (!user || !listing.donor) return false;

    const donorId =
      typeof listing.donor === "object" ? listing.donor._id : listing.donor;

    return donorId?.toString() === user._id?.toString();
  };

  if (loading) {
    return (
      <ListingsContainer
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
          <motion.div variants={motionVariants.rotate} animate="animate">
            <LoadingSpinner />
          </motion.div>
          <motion.p
            variants={motionVariants.fadeSlideUp}
            style={{ color: "#718096", fontSize: "1.1rem" }}
          >
            Loading listings...
          </motion.p>
        </div>
      </ListingsContainer>
    );
  }

  if (error) {
    return (
      <ListingsContainer
        as={motion.div}
        variants={motionVariants.pageTransition}
        initial="hidden"
        animate="show"
      >
        <EmptyState
          as={motion.div}
          variants={motionVariants.scalePop}
          initial="hidden"
          animate="show"
        >
          <EmptyIcon
            as={motion.div}
            animate={{
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
            }}
          >
            ❌
          </EmptyIcon>
          <EmptyText style={{ color: "#e53e3e" }}>{error}</EmptyText>
          <RetryButton
            as={motion.button}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchListings}
          >
            Try Again
          </RetryButton>
        </EmptyState>
      </ListingsContainer>
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
      <Header
        as={motion.div}
        variants={motionVariants.fadeSlideDown}
        initial="hidden"
        animate="show"
      >
        <Title>🍎 Available Food Donations</Title>
        <AnimatePresence mode="wait">
          {listings.length > 0 && (
            <Subtitle
              as={motion.p}
              variants={motionVariants.fadeSlideUp}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              Found {listings.length} listing{listings.length !== 1 ? "s" : ""}{" "}
              ready for pickup
            </Subtitle>
          )}
        </AnimatePresence>
      </Header>

      <AnimatePresence mode="wait">
        {listings.length === 0 ? (
          <EmptyState
            as={motion.div}
            key="empty"
            variants={motionVariants.scalePop}
            initial="hidden"
            animate="show"
            exit="exit"
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
            <EmptyText>No listings available at the moment.</EmptyText>
            <EmptySubtext>
              Check back later or create your own listing!
            </EmptySubtext>
          </EmptyState>
        ) : (
          <Grid
            as={motion.div}
            key="grid"
            variants={motionVariants.staggerContainer}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {listings.map((listing, index) => (
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
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </Grid>
        )}
      </AnimatePresence>
    </ListingsContainer>
  );
};

export default Listings;