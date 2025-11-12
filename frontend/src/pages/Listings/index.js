// src/pages/Listings/index.jsx - FIXED WITH OWNER ACTIONS

import styled from "styled-components";
import { useState, useEffect } from "react";
import api from "../../services/api";
import ListingCard from "../../components/ListingCard";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext"; // ✅ ADD THIS
import { toast } from "react-toastify"; // ✅ ADD THIS

const ListingsContainer = styled.div`
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: calc(100vh - 80px);
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
  font-size: 1.2rem;
`;

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // ✅ Get current user

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching listings...");

      const response = await api.get("/listings");
      console.log("📥 Response:", response.data);

      const fetchedListings =
        response.data.listings || response.data.data || [];

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

  // ✅ ADD: Delete handler
  const handleDelete = async (listing) => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }

    try {
      console.log("🗑️ Deleting listing:", listing._id);
      await api.delete(`/listings/${listing._id}`);
      
      toast.success("Listing deleted successfully");
      
      // Remove from UI
      setListings(prev => prev.filter(l => l._id !== listing._id));
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  // ✅ ADD: Check if user owns a listing
  const isOwner = (listing) => {
    if (!user || !listing.donor) return false;
    
    const donorId = typeof listing.donor === 'object' 
      ? listing.donor._id 
      : listing.donor;
    
    return donorId?.toString() === user._id?.toString();
  };

  if (loading) {
    return (
      <ListingsContainer>
        <LoadingSpinner />
      </ListingsContainer>
    );
  }

  if (error) {
    return (
      <ListingsContainer>
        <EmptyState style={{ color: "#e53e3e" }}>
          ❌ {error}
          <br />
          <button
            onClick={fetchListings}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#f093fb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </EmptyState>
      </ListingsContainer>
    );
  }

  return (
    <ListingsContainer>
      <Title>🍎 Available Food Donations</Title>
      {listings.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
          <div>No listings available at the moment.</div>
          <div
            style={{
              fontSize: "0.9rem",
              marginTop: "0.5rem",
              color: "#a0aec0",
            }}
          >
            Check back later or create your own listing!
          </div>
        </EmptyState>
      ) : (
        <>
          <div style={{ marginBottom: "1rem", color: "#718096" }}>
            Found {listings.length} listing{listings.length !== 1 ? "s" : ""}
          </div>
          <Grid>
            {listings.map((listing) => (
              <ListingCard 
                key={listing._id} 
                listing={listing}
                isOwner={isOwner(listing)} // ✅ Pass ownership status
                onDelete={handleDelete} // ✅ Pass delete handler
              />
            ))}
          </Grid>
        </>
      )}
    </ListingsContainer>
  );
};

export default Listings;